import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { OrderedBlocks } from './OrderedBlocks';

function slipDate(iso: string): string {
  const [year, month, day] = (iso || '').split('-');
  if (!year || !month || !day) return iso || '';
  return `${day}/${month}/${year.slice(-2)}`;
}

export const CashMemo: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => (
  <div className="w-[320px] bg-white text-neutral-950 p-4 font-sans text-[12px] leading-snug select-none">
    <OrderedBlocks
      order={style.layoutOrder}
      blocks={{
        logo: (
          <div className="text-center mb-1">
            {style.showLogo && restaurant.logoUrl && (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="inline-block h-12 w-auto max-w-[150px] object-contain"
              />
            )}
          </div>
        ),
        header: (
          <div className="text-center pb-2">
            <p className="text-[10px] font-bold tracking-[0.2em]">CASH MEMO</p>
            <h1 className="text-base font-bold">{restaurant.name || 'Restaurant'}</h1>
            {restaurant.phone && <p className="text-[11px]">{restaurant.phone}</p>}
            {style.showGstin && restaurant.gstin && (
              <p className="text-[11px]">GST {restaurant.gstin}</p>
            )}
          </div>
        ),
        details: (
          <div className="border-y border-neutral-950 py-1.5 text-[11px] space-y-0.5">
            <p>Name: {details.customerName || '—'}</p>
            <div className="flex justify-between">
              <span>Date: {slipDate(details.date)}</span>
              <span>No: {details.billNumber}</span>
            </div>
          </div>
        ),
        items: (
          <div className="py-1.5">
            <div className="flex font-bold text-[11px] border-b border-neutral-950 pb-0.5">
              <span className="flex-1">Item</span>
              <span className="w-10 text-center">Qty</span>
              <span className="w-16 text-right">Amt</span>
            </div>
            {items.map((item, index) => (
              <div key={item.id || index} className="flex mt-1">
                <span className="flex-1 pr-1">{item.name || 'Item'}</span>
                <span className="w-10 text-center tabular-nums">{item.quantity}</span>
                <span className="w-16 text-right tabular-nums">{formatINR(item.amount, false)}</span>
              </div>
            ))}
          </div>
        ),
        totals: (
          <div className="border border-neutral-950 px-2 py-1.5 space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatINR(calculated.grossAmount, false)}</span>
            </div>
            {calculated.discountAmount > 0 && (
              <div className="flex justify-between text-[11px]">
                <span>Discount</span>
                <span className="tabular-nums">-{formatINR(calculated.discountAmount, false)}</span>
              </div>
            )}
            {gst.enabled && calculated.totalTax > 0 && (
              <div className="flex justify-between text-[11px]">
                <span>GST {calculated.taxRate}%</span>
                <span className="tabular-nums">{formatINR(calculated.totalTax, false)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm border-t border-neutral-950 pt-1">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatINR(calculated.grandTotal)}</span>
            </div>
          </div>
        ),
        footer: (
          <p className="text-center text-[11px] mt-2">
            {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you. Visit again.'}
          </p>
        ),
      }}
    />
  </div>
);
