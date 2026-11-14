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

export const CashMemo: React.FC<TemplateProps> = ({
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
          <div className="mb-1" style={{ textAlign: style.headerAlignment }}>
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
          <div className="pb-2" style={{ textAlign: style.headerAlignment }}>
            <p className="font-bold tracking-[0.2em]">CASH MEMO</p>
            <h1 style={nameLook(style.styleVariant, fontPx(style.fontSize) + 4)}>{restaurant.name || 'Restaurant'}</h1>
            {restaurant.phone && <p>{restaurant.phone}</p>}
            {showGstLine(style, restaurant) && <p>GST {restaurant.gstin}</p>}
            {showFssaiLine(style, restaurant) && <p>FSSAI {restaurant.fssai}</p>}
          </div>
        ),
        details: (
          <div
            className="py-1.5 space-y-0.5"
            style={{ borderTop: `1px ${style.dividerStyle} #000000`, borderBottom: `1px ${style.dividerStyle} #000000` }}
          >
            <p>Name: {details.customerName || '—'}</p>
            <div className="flex justify-between">
              <span>Date: {slipDate(details.date)}{style.showBillTime && details.time ? ` ${details.time}` : ''}</span>
              <span>No: {details.billNumber}</span>
            </div>
            {style.showCashier && details.cashier && <p>Cashier: {details.cashier}</p>}
          </div>
        ),
        items: (
          <div className="py-1.5">
            <div className="flex font-bold pb-0.5" style={{ borderBottom: `1px ${style.dividerStyle} #000000` }}>
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
          <div className="px-2 py-1.5 space-y-0.5" style={{ border: `1px ${style.dividerStyle} #000000` }}>
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
            <div style={ruleCss(style.dividerStyle, 4)} />
            <div className="flex justify-between font-bold text-sm pt-1">
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
