import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { OrderedBlocks } from './OrderedBlocks';

function slipDate(iso: string): string {
  const [year, month, day] = (iso || '').split('-');
  if (!year || !month || !day) return iso || '';
  return `${day}/${month}/${year.slice(-2)}`;
}

export const ShortSlip: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => (
  <div className="w-[230px] bg-white text-neutral-950 p-3 font-sans text-[11px] leading-tight select-none">
    <OrderedBlocks
      order={style.layoutOrder}
      blocks={{
        logo: (
          <div className="text-center mb-1">
            {style.showLogo && restaurant.logoUrl && (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="inline-block h-10 w-auto max-w-[120px] object-contain"
              />
            )}
          </div>
        ),
        header: (
          <div className="text-center">
            <h1 className="text-sm font-bold">{restaurant.name || 'Restaurant'}</h1>
            {restaurant.phone && <p className="text-[10px]">{restaurant.phone}</p>}
          </div>
        ),
        details: (
          <div className="flex justify-between text-[10px] border-y border-neutral-950 my-1 py-1">
            <span>
              {slipDate(details.date)}
              {style.showBillTime && details.time ? ` ${details.time}` : ''}
            </span>
            <span>#{details.billNumber}</span>
          </div>
        ),
        items: (
          <div className="space-y-1 py-1">
            {items.map((item, index) => (
              <div key={item.id || index} className="flex justify-between gap-2">
                <span className="flex-1 truncate">
                  {item.quantity} {item.name || 'Item'}
                </span>
                <span className="tabular-nums">{formatINR(item.amount, false)}</span>
              </div>
            ))}
          </div>
        ),
        totals: (
          <div className="border-t border-neutral-950 pt-1">
            {gst.enabled && calculated.totalTax > 0 && (
              <div className="flex justify-between text-[10px]">
                <span>GST</span>
                <span className="tabular-nums">{formatINR(calculated.totalTax, false)}</span>
              </div>
            )}
            {calculated.discountAmount > 0 && (
              <div className="flex justify-between text-[10px]">
                <span>Less</span>
                <span className="tabular-nums">-{formatINR(calculated.discountAmount, false)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[13px] mt-0.5">
              <span>TOTAL</span>
              <span className="tabular-nums">{formatINR(calculated.grandTotal)}</span>
            </div>
          </div>
        ),
        footer: (
          <p className="text-center text-[10px] mt-2">
            {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you'}
          </p>
        ),
      }}
    />
  </div>
);
