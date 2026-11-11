import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { getDividerClass, getFontSizeScale, getVariantStyles } from './templateUtils';
import { OrderedBlocks } from './OrderedBlocks';

export const CompactThermal: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => {
  const fontScale = getFontSizeScale(style.fontSize);
  const variant = getVariantStyles(style.styleVariant);
  const divider = getDividerClass(style.dividerStyle);

  const headerAlignClass = style.headerAlignment === 'left' ? 'text-left' : 'text-center';

  return (
    <div className="w-[230px] bg-white text-neutral-900 p-3 font-mono text-[10px] leading-tight select-none">
      <OrderedBlocks
        order={style.layoutOrder}
        blocks={{
          logo: (
            <div className={`mb-1 ${headerAlignClass}`}>
              {style.showLogo && restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="inline-block h-12 w-auto max-w-[140px] object-contain"
                />
              )}
            </div>
          ),
          header: (
      <>
      <div className={`mb-2 ${headerAlignClass}`}>
        <h1 className={`text-sm font-bold ${variant.headerWeight} tracking-tight`}>
          {restaurant.name || 'RESTAURANT'}
        </h1>
        {restaurant.address && (
          <p className="whitespace-pre-line text-[9px] text-neutral-600 line-clamp-2 mt-0.5">
            {restaurant.address}
          </p>
        )}
        {restaurant.phone && (
          <p className="text-[9px] text-neutral-600">Ph: {restaurant.phone}</p>
        )}
        {style.showGstin && restaurant.gstin && (
          <p className="text-[9px] font-semibold">GST: {restaurant.gstin}</p>
        )}
      </div>

      <div className={`${divider} my-1.5`}></div>
      </>
          ),
          details: (
      <>
      <div className="space-y-0.5 text-[9px] mb-1">
        <div className="flex justify-between">
          <span>#{details.billNumber}</span>
          <span>{details.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold uppercase">{details.diningType.replace('_', ' ')}</span>
          {details.diningType === 'dine_in' && details.tableNumber && (
            <span className="font-bold">T:{details.tableNumber}</span>
          )}
        </div>
        {details.customerName && (
          <div className="truncate">Cust: {details.customerName}</div>
        )}
      </div>

      <div className={`${divider} my-1.5`}></div>
      </>
          ),
          items: (
      <>
      <div className="space-y-1 text-[9px] mb-1">
        <div className="flex justify-between font-bold border-b border-neutral-300 pb-0.5 text-[8.5px]">
          <span className="w-[55%]">ITEM</span>
          <span className="w-[15%] text-center">QTY</span>
          <span className="w-[30%] text-right">AMT</span>
        </div>
        {items.map((item, idx) => (
          <div key={item.id || idx} className="space-y-0.5">
            <div className="flex justify-between items-start">
              <span className="font-medium w-[55%] truncate">{item.name}</span>
              <span className="w-[15%] text-center tabular-nums">{item.quantity}</span>
              <span className="w-[30%] text-right font-semibold tabular-nums">
                {formatINR(item.amount, false)}
              </span>
            </div>
            <div className="text-[8px] text-neutral-500 pl-1">
              @{formatINR(item.unitPrice, false)} each
            </div>
          </div>
        ))}
      </div>

      <div className={`${divider} my-1.5`}></div>
      </>
          ),
          totals: (
      <>
      <div className="space-y-0.5 text-[9px] mb-1">
        <div className="flex justify-between">
          <span>Qty: {calculated.totalQuantity}</span>
          <span>Sub: {formatINR(calculated.grossAmount)}</span>
        </div>

        {calculated.discountAmount > 0 && (
          <div className="flex justify-between text-neutral-700">
            <span>Disc:</span>
            <span className="tabular-nums">-{formatINR(calculated.discountAmount)}</span>
          </div>
        )}

        {gst.enabled && calculated.totalTax > 0 && (
          <div className="flex justify-between text-neutral-600 text-[8.5px]">
            <span>
              {gst.taxType === 'intrastate' ? `GST (${calculated.taxRate}%)` : `IGST (${calculated.taxRate}%)`}:
            </span>
            <span className="tabular-nums">{formatINR(calculated.totalTax)}</span>
          </div>
        )}

        {calculated.roundOff !== 0 && (
          <div className="flex justify-between text-neutral-500 text-[8px]">
            <span>Round off:</span>
            <span>{formatINR(calculated.roundOff)}</span>
          </div>
        )}
      </div>

      <div className={`${divider} my-1.5`}></div>

      {/* Total */}
      <div className="flex justify-between items-center py-0.5 font-bold">
        <span className="text-[10px] uppercase">TOTAL</span>
        <span className="text-sm tabular-nums">{formatINR(calculated.grandTotal)}</span>
      </div>

      <div className={`${divider} my-2`}></div>
      </>
          ),
          footer: (
      <div className="text-center text-[8px] text-neutral-500 space-y-0.5">
        <p>{restaurant.footerMessage?.trim() || style.footerMessage || 'Thank You!'}</p>
        {style.showFssai && restaurant.fssai && (
          <p className="text-[7.5px]">Lic: {restaurant.fssai}</p>
        )}
      </div>
          ),
        }}
      />
    </div>
  );
};
