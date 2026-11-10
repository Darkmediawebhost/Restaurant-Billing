import React, { useState, useRef } from 'react';
import {
  Building2,
  Upload,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';
import { RestaurantInfo } from '../types/billing';
import { validateGSTIN, validateFSSAI } from '../utils/calculations';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gstinValidation = validateGSTIN(restaurant.gstin);
  const fssaiValidation = validateFSSAI(restaurant.fssai);

  const handleFieldChange = (field: keyof RestaurantInfo, value: any) => {
    onChange({ ...restaurant, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid PNG, JPG, or WebP image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleFieldChange('logoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
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
          {/* Restaurant Name & Logo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800">
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={restaurant.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g. The Golden Fork Bistro"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
                <span>Restaurant Logo</span>
                {restaurant.logoUrl && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                )}
              </label>

              {restaurant.logoUrl ? (
                <div className="flex items-center gap-2 p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={restaurant.logoUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain filter grayscale"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-neutral-700 hover:text-neutral-950 font-medium truncate block text-left"
                    >
                      Replace Logo
                    </button>
                    <span className="text-[10px] text-neutral-400">PNG / JPG / WebP</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-10 px-3 bg-neutral-50 border border-dashed border-neutral-300 rounded-lg flex items-center justify-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Upload Logo</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
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

          {/* Footer Note & Save action */}
          <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-neutral-800">
                Receipt Footer Message
              </label>
              <input
                type="text"
                value={restaurant.footerMessage}
                onChange={(e) => handleFieldChange('footerMessage', e.target.value)}
                placeholder="Thank you for dining with us! Please visit again."
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>
            <div className="sm:self-end pt-1">
              <button
                type="button"
                onClick={onSaveDefault}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 whitespace-nowrap"
              >
                Save as Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
