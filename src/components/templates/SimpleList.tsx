import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { OrderedBlocks } from './OrderedBlocks';
import { fontPx, nameLook, ruleCss, showFssaiLine, showGstLine } from './templateUtils';
import { billFontProps } from '../../utils/receiptFonts';

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
  <div
    className={`w-[320px] bg-white text-neutral-950 p-4 font-sans leading-snug select-none ${billFontProps(style.fontFamily).className}`}
    style={{ fontSize: fontPx(style.fontSize), ...billFontProps(style.fontFamily).style }}
  >
    <OrderedBlocks
      order={style.layoutOrder}
      blocks={{
        logo: (
          <div className="mb-2" style={{ textAlign: style.headerAlignment }}>
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
          <div className="pb-2" style={{ textAlign: style.headerAlignment, borderBottom: `1px ${style.dividerStyle} #000000` }}>
            <h1 style={nameLook(style.styleVariant, fontPx(style.fontSize) + 4)}>{restaurant.name || 'Restaurant'}</h1>
            {restaurant.address && (
              <p className="whitespace-pre-line">{restaurant.address}</p>
            )}
            {restaurant.phone && <p>{restaurant.phone}</p>}
            {showGstLine(style, restaurant) && <p>GST {restaurant.gstin}</p>}
            {showFssaiLine(style, restaurant) && <p>FSSAI {restaurant.fssai}</p>}
          </div>
        ),
        details: (
          <div className="py-1.5" style={{ borderBottom: `1px ${style.dividerStyle} #000000` }}>
            <div className="flex justify-between">
              <span>{slipDate(details.date)}{style.showBillTime && details.time ? `  ${details.time}` : ''}</span>
              <span>{details.billNumber}</span>
            </div>
            {details.customerName && <p>Name: {details.customerName}</p>}
            {style.showCashier && details.cashier && <p>Cashier: {details.cashier}</p>}
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
          <div>
          <div style={ruleCss(style.dividerStyle)} />
          <div className="pt-1.5 space-y-0.5">
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
            <div style={ruleCss(style.dividerStyle, 4)} />
            <div className="pt-1 flex justify-between font-bold text-sm">
              <span>TOTAL</span>
              <span className="tabular-nums">{formatINR(calculated.grandTotal)}</span>
            </div>
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
