import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { getFontSizeScale, getVariantStyles } from './templateUtils';

export const ElegantMinimal: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => {
  const fontScale = getFontSizeScale(style.fontSize);
  const variant = getVariantStyles(style.styleVariant);

  return (
    <div className="w-[680px] bg-white text-neutral-900 p-12 font-sans text-xs select-none">
      {/* Refined Minimalist Header */}
      <div className="text-center mb-8 pb-6 border-b border-neutral-100">
        {style.showLogo && restaurant.logoUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="max-h-12 max-w-[160px] object-contain filter grayscale opacity-90"
            />
          </div>
        )}
        <h1 className="text-2xl font-light tracking-[0.25em] text-neutral-900 uppercase">
          {restaurant.name || 'Restaurant'}
        </h1>
        {restaurant.address && (
          <p className="text-[11px] font-light text-neutral-500 mt-2 max-w-md mx-auto whitespace-pre-line tracking-wide">
            {restaurant.address}
          </p>
        )}
        <div className="flex justify-center gap-4 text-[10px] text-neutral-400 mt-2 tracking-wider">
          {restaurant.phone && <span>T. {restaurant.phone}</span>}
          {style.showGstin && restaurant.gstin && <span>GSTIN {restaurant.gstin}</span>}
          {style.showFssai && restaurant.fssai && <span>FSSAI {restaurant.fssai}</span>}
        </div>
      </div>

      {/* Bill Meta in 4-column minimal hairline strip */}
      <div className="grid grid-cols-4 gap-4 py-3 border-y border-neutral-100 mb-8 text-[11px]">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">
            Invoice
          </span>
          <span className="font-mono text-neutral-900">{details.billNumber}</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">
            Date & Time
          </span>
          <span className="text-neutral-800">
            {details.date} {style.showBillTime && details.time && `· ${details.time}`}
          </span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">
            Dining
          </span>
          <span className="text-neutral-800 uppercase tracking-wide">
            {details.diningType.replace('_', ' ')}
            {details.diningType === 'dine_in' && details.tableNumber && ` · T${details.tableNumber}`}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">
            Guest
          </span>
          <span className="text-neutral-900 font-medium">
            {details.customerName || 'Walk-in'}
          </span>
        </div>
      </div>

      {/* Elegant Clean Table */}
      <table className="w-full text-left text-xs mb-8">
        <thead>
          <tr className="border-b border-neutral-900 text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-medium">
            <th className="py-2.5 pl-1">Course & Item</th>
            <th className="py-2.5 text-center w-16">Qty</th>
            <th className="py-2.5 text-right w-24">Price</th>
            <th className="py-2.5 pr-1 text-right w-28">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {items.map((item, idx) => (
            <tr key={item.id || idx}>
              <td className="py-3 pl-1 font-normal text-neutral-900">{item.name}</td>
              <td className="py-3 text-center font-mono text-neutral-600">{item.quantity}</td>
              <td className="py-3 text-right font-mono text-neutral-500">
                {formatINR(item.unitPrice, false)}
              </td>
              <td className="py-3 pr-1 text-right font-mono font-medium text-neutral-900">
                {formatINR(item.amount, false)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Minimalist Summary */}
      <div className="flex justify-end mb-10">
        <div className="w-72 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span className="font-mono text-neutral-800">{formatINR(calculated.grossAmount)}</span>
          </div>

          {calculated.discountAmount > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>
                Privilege Discount{' '}
                {calculated.discountType === 'percentage' ? `(${calculated.discountValue}%)` : ''}
              </span>
              <span className="font-mono">-{formatINR(calculated.discountAmount)}</span>
            </div>
          )}

          {gst.enabled && calculated.totalTax > 0 && (
            <div className="flex justify-between text-neutral-500 text-[11px]">
              <span>Taxes (GST {calculated.taxRate}%)</span>
              <span className="font-mono">{formatINR(calculated.totalTax)}</span>
            </div>
          )}

          {calculated.roundOff !== 0 && (
            <div className="flex justify-between text-neutral-400 text-[10px]">
              <span>Round off</span>
              <span className="font-mono">{formatINR(calculated.roundOff)}</span>
            </div>
          )}

          <div className="border-t border-neutral-900 pt-3 flex justify-between items-baseline text-sm font-medium text-neutral-950">
            <span className="tracking-[0.1em] uppercase text-xs">Total Due</span>
            <span className="font-mono text-xl font-normal">{formatINR(calculated.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Elegant Footer */}
      <div className="text-center pt-8 border-t border-neutral-100 text-neutral-400 text-[10px] tracking-widest uppercase">
        <p className="text-neutral-600 font-normal">
          {style.footerMessage || restaurant.footerMessage || 'A pleasure to serve you'}
        </p>
        <p className="mt-1 text-[8px] text-neutral-300">RestoBill Bespoke Terminal</p>
      </div>
    </div>
  );
};
