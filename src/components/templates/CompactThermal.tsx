import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { fontPx, getFontSizeScale, getVariantStyles, ruleCss, showFssaiLine, showGstLine } from './templateUtils';
import { billFontProps } from '../../utils/receiptFonts';
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
  const rule = ruleCss(style.dividerStyle);

  const headerAlignClass = style.headerAlignment === 'left' ? 'text-left' : 'text-center';
  const chosenFont = billFontProps(style.fontFamily);

  return (
    <div
      className={`w-[230px] bg-white text-black p-3 font-mono leading-tight select-none ${chosenFont.className}`}
      style={{ fontSize: fontPx(style.fontSize, true), ...chosenFont.style }}
    >
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
        <h1 className={`${fontScale.title} ${variant.headerWeight} tracking-tight`}>
          {restaurant.name || 'RESTAURANT'}
        </h1>
        {restaurant.address && (
          <p className="whitespace-pre-line text-[0.9em] mt-0.5">
            {restaurant.address}
          </p>
        )}
        {restaurant.phone && (
          <p className="text-[0.9em]">Ph: {restaurant.phone}</p>
        )}
        {showGstLine(style, restaurant) && (
          <p className="font-semibold">GST: {restaurant.gstin}</p>
        )}
      </div>

      <div className="my-1.5" style={rule}></div>
      </>
          ),
          details: (
      <>
      <div className="space-y-0.5 text-[0.9em] mb-1">
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
        {style.showBillTime && details.time && (
          <div className="flex justify-between">
            <span>Time</span>
            <span>{details.time}</span>
          </div>
        )}
        {style.showCashier && details.cashier && (
          <div className="truncate">By: {details.cashier}</div>
        )}
      </div>

      <div className="my-1.5" style={rule}></div>
      </>
          ),
          items: (
      <>
      <div className="space-y-1 text-[0.9em] mb-1">
        <div className="flex justify-between font-bold pb-0.5" style={{ borderBottom: `1px ${style.dividerStyle} #000000` }}>
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
            <div className="text-[0.8em] pl-1">
              @{formatINR(item.unitPrice, false)} each
            </div>
          </div>
        ))}
      </div>

      <div className="my-1.5" style={rule}></div>
      </>
          ),
          totals: (
      <>
      <div className="ml-auto grid w-max max-w-full grid-cols-[auto_auto] gap-x-2 gap-y-0.5 text-[0.9em] mb-1">
        <span className="text-right">Qty:</span>
        <span className="text-right tabular-nums">{calculated.totalQuantity}</span>
        <span className="text-right">Sub:</span>
        <span className="text-right tabular-nums">{formatINR(calculated.grossAmount)}</span>

        {calculated.discountAmount > 0 && (
          <>
            <span className="text-right">Disc:</span>
            <span className="text-right tabular-nums">-{formatINR(calculated.discountAmount)}</span>
          </>
        )}

        {gst.enabled && calculated.totalTax > 0 && (
          <>
            <span className="text-right text-[0.85em]">
              {gst.taxType === 'intrastate' ? `GST (${calculated.taxRate}%)` : `IGST (${calculated.taxRate}%)`}:
            </span>
            <span className="text-right text-[0.85em] tabular-nums">{formatINR(calculated.totalTax)}</span>
          </>
        )}

        {calculated.roundOff !== 0 && (
          <>
            <span className="text-right text-[0.8em]">Round off:</span>
            <span className="text-right text-[0.8em] tabular-nums">{formatINR(calculated.roundOff)}</span>
          </>
        )}
      </div>

      <div className="my-1.5" style={rule}></div>

      {/* Total */}
      <div className="flex justify-between items-center py-0.5 font-bold">
        <span className="uppercase">TOTAL</span>
        <span className={`${fontScale.total} tabular-nums`}>{formatINR(calculated.grandTotal)}</span>
      </div>

      <div className="my-2" style={rule}></div>
      </>
          ),
          footer: (
      <div className="text-center text-[0.8em] space-y-0.5">
        <p>{restaurant.footerMessage?.trim() || style.footerMessage || 'Thank You!'}</p>
        {showFssaiLine(style, restaurant) && (
          <p className="text-[0.75em]">Lic: {restaurant.fssai}</p>
        )}
      </div>
          ),
        }}
      />
    </div>
  );
};
