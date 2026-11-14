import React from 'react';
import { Palette, AlignLeft, AlignCenter, Type, Eye, Minus } from 'lucide-react';
import {
  BillStyle,
  StyleVariant,
  FontSizeOption,
  HeaderAlignment,
  DividerStyle,
  ReceiptFontId,
} from '../types/billing';
import { RECEIPT_FONTS, receiptFontById } from '../utils/receiptFonts';

interface BillStyleSelectorProps {
  style: BillStyle;
  onChange: (style: BillStyle) => void;
}

export const BillStyleSelector: React.FC<BillStyleSelectorProps> = ({ style, onChange }) => {
  const handleFieldChange = (field: keyof BillStyle, value: any) => {
    onChange({ ...style, [field]: value });
  };

  const variants: { id: StyleVariant; label: string; desc: string }[] = [
    { id: 'classic', label: 'Classic', desc: 'Traditional receipt with dashed rules' },
    { id: 'modern', label: 'Modern', desc: 'Clean contemporary sans layout' },
    { id: 'compact', label: 'Compact', desc: 'Space-saving density' },
    { id: 'bold', label: 'Bold', desc: 'Heavy typography & dark accents' },
    { id: 'elegant', label: 'Elegant', desc: 'Minimal hairline luxury feel' },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
          <Palette className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Bill Style & Customization</h3>
          <p className="text-xs text-neutral-500">Fine-tune receipt typography, dividers, and visibility</p>
        </div>
      </div>

      {/* Style Variants */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-800 block">Style Theme</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {variants.map((v) => {
            const isSelected = style.styleVariant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleFieldChange('styleVariant', v.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-900'
                }`}
              >
                <div className="font-semibold text-xs">{v.label}</div>
                <div
                  className={`text-[10px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {v.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography & Alignment Grid */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="space-y-1.5">
          <label htmlFor="receipt-font" className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-neutral-400" />
            <span>Receipt Font</span>
          </label>
          <select
            id="receipt-font"
            value={style.fontFamily || 'default'}
            onChange={(e) => handleFieldChange('fontFamily', e.target.value as ReceiptFontId)}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
            style={{ fontFamily: receiptFontById(style.fontFamily).stack || undefined }}
          >
            {(['Default', 'Sans', 'Mono', 'Serif'] as const).map((group) => (
              <optgroup key={group} label={group}>
                {RECEIPT_FONTS.filter((font) => font.group === group).map((font) => (
                  <option key={font.id} value={font.id} style={{ fontFamily: font.stack || undefined }}>
                    {font.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p
            className="text-sm text-neutral-900 leading-tight"
            style={{ fontFamily: receiptFontById(style.fontFamily).stack || undefined }}
          >
            The Golden Fork Bistro · Biryani 2 × ₹220
          </p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Font Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-neutral-400" />
            <span>Font Size</span>
          </label>
          <div className="flex p-1 bg-neutral-100 rounded-lg">
            {(['small', 'medium', 'large'] as FontSizeOption[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleFieldChange('fontSize', size)}
                className={`flex-1 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                  style.fontSize === size
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Header Alignment */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800">Header Alignment</label>
          <div className="flex p-1 bg-neutral-100 rounded-lg">
            <button
              type="button"
              onClick={() => handleFieldChange('headerAlignment', 'left')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md transition-all ${
                style.headerAlignment === 'left'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Left</span>
            </button>
            <button
              type="button"
              onClick={() => handleFieldChange('headerAlignment', 'center')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md transition-all ${
                style.headerAlignment === 'center'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>
          </div>
        </div>

        {/* Divider Style */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <Minus className="w-3.5 h-3.5 text-neutral-400" />
            <span>Divider Line</span>
          </label>
          <div className="flex p-1 bg-neutral-100 rounded-lg">
            {(['solid', 'dashed', 'dotted'] as DividerStyle[]).map((divStyle) => (
              <button
                key={divStyle}
                type="button"
                onClick={() => handleFieldChange('dividerStyle', divStyle)}
                className={`flex-1 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                  style.dividerStyle === divStyle
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {divStyle}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Visibility Toggles */}
      <div className="pt-2 border-t border-neutral-100 space-y-2">
        <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span>Show / Hide Receipt Elements</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors">
            <input
              type="checkbox"
              checked={style.showLogo}
              onChange={(e) => handleFieldChange('showLogo', e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
            />
            <span className="text-neutral-800 font-medium">Logo</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors">
            <input
              type="checkbox"
              checked={style.showGstin}
              onChange={(e) => handleFieldChange('showGstin', e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
            />
            <span className="text-neutral-800 font-medium">GSTIN</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors">
            <input
              type="checkbox"
              checked={style.showFssai}
              onChange={(e) => handleFieldChange('showFssai', e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
            />
            <span className="text-neutral-800 font-medium">FSSAI Lic</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors">
            <input
              type="checkbox"
              checked={style.showCashier}
              onChange={(e) => handleFieldChange('showCashier', e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
            />
            <span className="text-neutral-800 font-medium">Cashier</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors">
            <input
              type="checkbox"
              checked={style.showBillTime}
              onChange={(e) => handleFieldChange('showBillTime', e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
            />
            <span className="text-neutral-800 font-medium">Bill Time</span>
          </label>
        </div>
      </div>
    </div>
  );
};
