import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { OrderedBlocks } from './OrderedBlocks';

function slipDate(iso: string): string {
  const [year, month, day] = (iso || '').split('-');
  if (!year || !month || !day) return iso || '';
  return `${day}/${month}/${year.slice(-2)}`;
}

export const SimpleList: React.FC<TemplateProps> = ({
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
          <div className="text-center mb-2">
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
          <div className="text-center pb-2 border-b border-neutral-950">
            <h1 className="text-base font-bold">{restaurant.name || 'Restaurant'}</h1>
            {restaurant.address && (
              <p className="whitespace-pre-line text-[11px]">{restaurant.address}</p>
            )}
            {restaurant.phone && <p className="text-[11px]">{restaurant.phone}</p>}
          </div>
        ),
        details: (
          <div className="py-1.5 text-[11px] border-b border-neutral-950">
            <div className="flex justify-between">
              <span>{slipDate(details.date)}{style.showBillTime && details.time ? `  ${details.time}` : ''}</span>
              <span>{details.billNumber}</span>
            </div>
            {details.customerName && <p>Name: {details.customerName}</p>}
          </div>
        ),
        items: (
          <div className="py-1.5 space-y-1">
            {items.map((item, index) => (
              <div key={item.id || index} className="flex justify-between gap-3">
                <span className="flex-1">
                  {item.quantity}  {item.name || 'Item'}
                </span>
                <span className="tabular-nums">{formatINR(item.amount, false)}</span>
              </div>
            ))}
          </div>
        ),
        totals: (
          <div className="border-t border-neutral-950 pt-1.5 space-y-0.5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatINR(calculated.grossAmount, false)}</span>
            </div>
            {calculated.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="tabular-nums">-{formatINR(calculated.discountAmount, false)}</span>
              </div>
            )}
            {gst.enabled && calculated.totalTax > 0 && (
              <div className="flex justify-between">
                <span>GST {calculated.taxRate}%</span>
                <span className="tabular-nums">{formatINR(calculated.totalTax, false)}</span>
              </div>
            )}
            <div className="border-t-2 border-neutral-950 mt-1 pt-1 flex justify-between font-bold text-sm">
              <span>TOTAL</span>
              <span className="tabular-nums">{formatINR(calculated.grandTotal)}</span>
            </div>
          </div>
        ),
        footer: (
          <p className="text-center text-[11px] mt-2">
            {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you'}
          </p>
        ),
      }}
    />
  </div>
);
