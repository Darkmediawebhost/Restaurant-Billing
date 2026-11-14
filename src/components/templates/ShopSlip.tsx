import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { OrderedBlocks } from './OrderedBlocks';
import { fontPx, nameLook, ruleCss, showFssaiLine, showGstLine } from './templateUtils';

function slipDate(iso: string): string {
  const [year, month, day] = (iso || '').split('-');
  if (!year || !month || !day) return iso || '';
  return `${day}/${month}/${year.slice(-2)}`;
}

function diningLabel(type: string): string {
  if (type === 'takeaway') return 'Takeaway';
  if (type === 'delivery') return 'Delivery';
  return 'Dine In';
}

function slipFooter(message: string): string {
  const text = message.trim();
  if (!text) return '***Thank You Visit Again***';
  if (text.startsWith('*')) return text;
  return `***${text}***`;
}

export const ShopSlip: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => {
  const dine = diningLabel(details.diningType);
  const table =
    details.diningType === 'dine_in' && details.tableNumber
      ? details.tableNumber.replace(/^t-?/i, '')
      : '';
  const money = (value: number) => formatINR(value, false);
  const size = fontPx(style.fontSize);
  const align = style.headerAlignment === 'left' ? 'left' : 'center';

  return (
    <div
      className="w-[302px] bg-white text-black px-3 py-3 select-none"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: size,
        lineHeight: style.styleVariant === 'compact' ? 1.05 : 1.2,
      }}
    >
      <OrderedBlocks
        order={style.layoutOrder}
        blocks={{
          logo:
            style.showLogo && restaurant.logoUrl ? (
              <div className="text-center mb-1">
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="inline-block h-12 w-auto max-w-[140px] object-contain"
                />
              </div>
            ) : (
              <></>
            ),
          header: (
            <div style={{ textAlign: align }}>
              <h1 style={nameLook(style.styleVariant, size + 4)}>{restaurant.name || 'Restaurant Name'}</h1>
              {restaurant.address && (
                <p className="whitespace-pre-line mt-0.5">{restaurant.address}</p>
              )}
              {restaurant.phone && <p>Mob : {restaurant.phone}</p>}
              {showGstLine(style, restaurant) && <p>GST - {restaurant.gstin}</p>}
              {showFssaiLine(style, restaurant) && <p>FSSAI - {restaurant.fssai}</p>}
            </div>
          ),
          details: (
            <div>
              <p className="py-[3px]">Name: {details.customerName || ''}</p>
              <div className="py-[3px]">
                <div className="flex items-start justify-between gap-3">
                  <p>Date: {slipDate(details.date)}</p>
                  <p className="font-bold text-[13px] leading-tight whitespace-nowrap">
                    {dine}
                    {table ? `: ${table}` : ''}
                  </p>
                </div>
                {style.showBillTime && details.time ? <p>{details.time}</p> : null}
                <div className="flex items-start justify-between gap-3">
                  <p>
                    {style.showCashier && details.cashier ? `Cashier: ${details.cashier}` : ''}
                  </p>
                  <p className="whitespace-nowrap">Bill No.: {details.billNumber}</p>
                </div>
              </div>
            </div>
          ),
          items: (
            <table className="w-full border-collapse mt-0.5">
              <thead>
                <tr className="font-semibold">
                  <th className="text-left font-semibold pb-0.5">Item</th>
                  <th className="text-center font-semibold w-8 pb-0.5">Qty.</th>
                  <th className="text-right font-semibold w-[3.4rem] pb-0.5">Price</th>
                  <th className="text-right font-semibold w-[3.6rem] pb-0.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index} className="align-top">
                    <td className="pr-1 break-words">{item.name || 'Item'}</td>
                    <td className="text-center tabular-nums">{item.quantity}</td>
                    <td className="text-right tabular-nums">{money(item.unitPrice)}</td>
                    <td className="text-right tabular-nums">{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ),
          totals: (
            <div className="pt-1">
              <table className="ml-auto border-collapse">
                <tbody>
                  <tr className="align-top">
                    <td className="pr-3 whitespace-nowrap">Total Qty: {calculated.totalQuantity}</td>
                    <td className="pr-2 text-left leading-tight whitespace-nowrap">
                      Sub
                      <br />
                      Total
                    </td>
                    <td className="text-right tabular-nums w-[3.6rem]">{money(calculated.grossAmount)}</td>
                  </tr>
                  {calculated.discountAmount > 0 && (
                    <tr>
                      <td colSpan={2} className="text-right pr-2 pt-0.5">
                        Discount
                        {calculated.discountType === 'percentage' ? ` ${calculated.discountValue}%` : ''}
                      </td>
                      <td className="text-right tabular-nums pt-0.5">
                        -{money(calculated.discountAmount)}
                      </td>
                    </tr>
                  )}
                  {gst.enabled && calculated.totalTax > 0 && gst.taxType === 'intrastate' && (
                    <>
                      <tr>
                        <td colSpan={2} className="text-right pr-2">
                          CGST {calculated.cgstRate}%
                        </td>
                        <td className="text-right tabular-nums">{money(calculated.cgstAmount)}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="text-right pr-2">
                          SGST {calculated.sgstRate}%
                        </td>
                        <td className="text-right tabular-nums">{money(calculated.sgstAmount)}</td>
                      </tr>
                    </>
                  )}
                  {gst.enabled && calculated.totalTax > 0 && gst.taxType !== 'intrastate' && (
                    <tr>
                      <td colSpan={2} className="text-right pr-2">
                        IGST {calculated.igstRate}%
                      </td>
                      <td className="text-right tabular-nums">{money(calculated.igstAmount)}</td>
                    </tr>
                  )}
                  {calculated.roundOff !== 0 && (
                    <tr>
                      <td colSpan={2} className="text-right pr-2">
                        Round Off
                      </td>
                      <td className="text-right tabular-nums">{money(calculated.roundOff)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={ruleCss(style.dividerStyle, 6)} />
              <div className="pt-1 flex items-baseline font-bold">
                <span className="flex-1 text-center text-[13px]">Grand Total</span>
                <span className="text-[15px] tabular-nums text-right">₹ {money(calculated.grandTotal)}</span>
              </div>
            </div>
          ),
          footer: (
            <p className="text-center text-[11px] mt-2">
              {slipFooter(restaurant.footerMessage || style.footerMessage || '')}
            </p>
          ),
        }}
      />
    </div>
  );
};
