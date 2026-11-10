import React, { useState, useRef } from 'react';
import {
  Building2,
  Upload,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RestaurantInfo } from '../types/billing';
import { validateGSTIN, validateFSSAI } from '../utils/calculations';

function logoFileToBlackAndWhite(file: File): Promise<string> {
  const draw = (source: CanvasImageSource, width: number, height: number) => {
    if (!width || !height) {
      throw new Error('Could not read that photo.');
    }
    const maxSide = 480;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Could not read that photo.');
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = pixels.data;
    let min = 255;
    let max = 0;
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
      if (gray < min) min = gray;
      if (gray > max) max = gray;
      total += gray;
    }
    const span = Math.max(1, max - min);
    const mean = data.length ? total / (data.length / 4) : 255;
    const invert = mean > 185;
    for (let i = 0; i < data.length; i += 4) {
      let tone = ((data[i] - min) / span) * 255;
      if (invert) tone = 255 - tone;
      data[i] = tone;
      data[i + 1] = tone;
      data[i + 2] = tone;
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const fromImage = () =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not open that photo.'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          try {
            resolve(draw(img, img.naturalWidth, img.naturalHeight));
          } catch (error) {
            reject(error instanceof Error ? error : new Error('Could not read that photo.'));
          }
        };
        img.onerror = () => reject(new Error('Could not open that photo.'));
        img.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });

  if (typeof createImageBitmap !== 'function') {
    return fromImage();
  }
  return createImageBitmap(file)
    .then((bitmap) => {
      try {
        return draw(bitmap, bitmap.width, bitmap.height);
      } finally {
        bitmap.close();
      }
    })
    .catch(() => fromImage());
}

interface RestaurantDetailsFormProps {
  restaurant: RestaurantInfo;
  onChange: (info: RestaurantInfo) => void;
  onSaveDefault: () => void;
}

export const RestaurantDetailsForm: React.FC<RestaurantDetailsFormProps> = ({
  restaurant,
  onChange,
  onSaveDefault,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [logoError, setLogoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gstinValidation = validateGSTIN(restaurant.gstin);
  const fssaiValidation = validateFSSAI(restaurant.fssai);

  const handleFieldChange = (field: keyof RestaurantInfo, value: any) => {
    onChange({ ...restaurant, [field]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      e.target.value = '';
      setLogoError('That photo is too large. Choose one under 20MB.');
      return;
    }

    setLogoError('');
    try {
      const logo = await logoFileToBlackAndWhite(file);
      handleFieldChange('logoUrl', logo);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not open that photo.';
      setLogoError(message);
    } finally {
      e.target.value = '';
    }
  };

  const removeLogo = () => {
    handleFieldChange('logoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs transition-all">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-neutral-50/70 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Restaurant Information</h3>
            <p className="text-xs text-neutral-500">
              {restaurant.name || 'Setup your restaurant profile & tax numbers'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-xs text-neutral-400 hidden sm:inline">
            {isExpanded ? 'Collapse' : 'Edit'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Form Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-neutral-100 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800">
              Restaurant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={restaurant.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g. The Golden Fork Bistro"
              className="w-full px-3 py-2.5 text-base sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-800">Restaurant Logo</label>
              {restaurant.logoUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-0.5"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
            {restaurant.logoUrl ? (
              <div className="space-y-2">
                <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-neutral-300 bg-white p-3">
                  <img
                    src={restaurant.logoUrl}
                    alt="Restaurant logo"
                    className="h-24 w-auto max-w-full object-contain"
                  />
                </div>
                <label className="relative flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 text-sm font-semibold text-neutral-900">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  Change logo
                </label>
              </div>
            ) : (
              <label className="relative flex min-h-[132px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm border border-neutral-200">
                  <Upload className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold text-neutral-900">Upload Logo</span>
                <span className="text-[11px] text-neutral-500">Tap a photo. It is saved in black and white.</span>
              </label>
            )}
            {logoError && <p className="text-[11px] text-red-600">{logoError}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800">Receipt Footer Message</label>
            <textarea
              rows={2}
              value={restaurant.footerMessage}
              onChange={(e) => handleFieldChange('footerMessage', e.target.value)}
              placeholder="Thank you for dining with us! Please visit again."
              className="w-full px-3 py-2.5 text-base sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all resize-none"
            />
            <p className="text-[11px] text-neutral-500">This line prints at the bottom of the bill.</p>
          </div>

          {/* Address & Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800">Address</label>
              <textarea
                rows={2}
                value={restaurant.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="142 Market Street, Indiranagar, Bangalore"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-800">Phone Number</label>
                <input
                  type="text"
                  value={restaurant.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-800">Email Address (Optional)</label>
                <input
                  type="email"
                  value={restaurant.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="contact@restaurant.com"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Statutory Details: GSTIN & FSSAI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            {/* GSTIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-800">GSTIN Number</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={restaurant.showGstin}
                    onChange={(e) => handleFieldChange('showGstin', e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span>Show on bill</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={restaurant.gstin}
                  onChange={(e) => handleFieldChange('gstin', e.target.value.toUpperCase())}
                  placeholder="29ABCDE1234F1Z5"
                  maxLength={15}
                  className={`w-full px-3 py-1.5 text-xs font-mono bg-neutral-50 border rounded-lg focus:outline-none focus:ring-1 transition-all ${
                    !gstinValidation.isValid && restaurant.gstin
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-neutral-200 focus:ring-neutral-900 focus:bg-white'
                  }`}
                />
                {restaurant.gstin && (
                  <div className="absolute right-2.5 top-2">
                    {gstinValidation.isValid ? (
                      <Check className="w-3.5 h-3.5 text-neutral-900" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {!gstinValidation.isValid && restaurant.gstin && (
                <p className="text-[10px] text-red-600">{gstinValidation.message}</p>
              )}
            </div>

            {/* FSSAI */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-800">
                  FSSAI License Number
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={restaurant.showFssai}
                    onChange={(e) => handleFieldChange('showFssai', e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span>Show on bill</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={restaurant.fssai}
                  onChange={(e) => handleFieldChange('fssai', e.target.value.replace(/\D/g, ''))}
                  placeholder="14-digit FSSAI number"
                  maxLength={14}
                  className={`w-full px-3 py-1.5 text-xs font-mono bg-neutral-50 border rounded-lg focus:outline-none focus:ring-1 transition-all ${
                    !fssaiValidation.isValid && restaurant.fssai
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-neutral-200 focus:ring-neutral-900 focus:bg-white'
                  }`}
                />
                {restaurant.fssai && (
                  <div className="absolute right-2.5 top-2">
                    {fssaiValidation.isValid ? (
                      <Check className="w-3.5 h-3.5 text-neutral-900" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {!fssaiValidation.isValid && restaurant.fssai && (
                <p className="text-[10px] text-red-600">{fssaiValidation.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onSaveDefault}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
            >
              Save as Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
