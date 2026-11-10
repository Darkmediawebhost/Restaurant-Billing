import React from 'react';
import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  BillCalculations,
} from '../../types/billing';
import { formatINR } from '../../utils/calculations';
import { getDividerClass, getFontSizeScale, getVariantStyles } from './templateUtils';

export interface TemplateProps {
  restaurant: RestaurantInfo;
  details: BillDetails;
  items: BillItem[];
  gst: GSTConfig;
  style: BillStyle;
  calculated: BillCalculations;
}

export const ClassicThermal: React.FC<TemplateProps> = ({
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
    <div className="w-[320px] bg-white text-neutral-900 p-5 font-mono text-[11px] leading-tight select-none">
      {/* Top Header */}
      <div className={`mb-3 ${headerAlignClass}`}>
        {style.showLogo && restaurant.logoUrl && (
          <div className="flex justify-center mb-2">
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="max-h-16 max-w-[180px] object-contain grayscale"
            />
          </div>
        )}
        <h1 className={`${fontScale.title} ${variant.headerWeight} tracking-tight`}>
          {restaurant.name || 'RESTAURANT NAME'}
        </h1>
        {restaurant.address && (
          <p className="whitespace-pre-line text-[10px] text-neutral-600 mt-1">
            {restaurant.address}
          </p>
        )}
        {restaurant.phone && (
          <p className="text-[10px] text-neutral-700 mt-0.5">Ph: {restaurant.phone}</p>
        )}
        {style.showGstin && restaurant.gstin && (
          <p className="text-[10px] text-neutral-800 font-semibold mt-0.5">
            GSTIN: {restaurant.gstin}
          </p>
        )}
        {style.showFssai && restaurant.fssai && (
          <p className="text-[10px] text-neutral-600 mt-0.5">FSSAI: {restaurant.fssai}</p>
        )}
      </div>

      <div className={`${divider} my-2`}></div>

      {/* Bill Meta Data */}
      <div className="space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span className="font-semibold">Bill No:</span>
          <span className="font-bold">{details.billNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{details.date}</span>
        </div>
        {style.showBillTime && details.time && (
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{details.time}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Dining Type:</span>
          <span className="font-semibold uppercase">{details.diningType.replace('_', ' ')}</span>
        </div>
        {details.diningType === 'dine_in' && details.tableNumber && (
          <div className="flex justify-between">
            <span className="font-semibold">Table:</span>
            <span className="font-bold text-xs">{details.tableNumber}</span>
          </div>
        )}
        {details.customerName && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-medium">{details.customerName}</span>
          </div>
        )}
        {style.showCashier && details.cashier && (
          <div className="flex justify-between text-neutral-500">
            <span>Cashier:</span>
            <span>{details.cashier}</span>
          </div>
        )}
      </div>

      <div className={`${divider} my-2`}></div>

      {/* Items Table */}
      <table className="w-full text-[10px]">
        <thead>
          <tr className={`${variant.tableHeadBg} border-b border-neutral-300`}>
            <th className="py-1 text-left font-bold w-[50%]">ITEM</th>
            <th className="py-1 text-center font-bold w-[15%]">QTY</th>
            <th className="py-1 text-right font-bold w-[17%]">RATE</th>
            <th className="py-1 text-right font-bold w-[18%]">AMT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-neutral-200">
          {items.map((item, index) => (
            <tr key={item.id || index}>
              <td className="py-1 text-left align-top pr-1">
                <span className="font-medium text-neutral-900 block leading-tight">
                  {item.name || 'Item'}
                </span>
              </td>
              <td className="py-1 text-center align-top tabular-nums">{item.quantity}</td>
              <td className="py-1 text-right align-top tabular-nums">
                {formatINR(item.unitPrice, false)}
              </td>
              <td className="py-1 text-right align-top font-semibold tabular-nums">
                {formatINR(item.amount, false)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={`${divider} my-2`}></div>

      {/* Calculations Summary */}
      <div className="space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span>Total Qty:</span>
          <span className="font-semibold tabular-nums">{calculated.totalQuantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold tabular-nums">{formatINR(calculated.grossAmount)}</span>
        </div>

        {calculated.discountAmount > 0 && (
          <div className="flex justify-between text-neutral-800">
            <span>
              Discount{' '}
              {calculated.discountType === 'percentage' ? `(${calculated.discountValue}%)` : ''}:
            </span>
            <span className="tabular-nums font-semibold">
              -{formatINR(calculated.discountAmount)}
            </span>
          </div>
        )}

        {gst.enabled && calculated.totalTax > 0 && (
          <div className="pt-0.5 space-y-0.5">
            {gst.taxType === 'intrastate' ? (
              <>
                <div className="flex justify-between text-neutral-600 text-[9px]">
                  <span>CGST ({calculated.cgstRate}%):</span>
                  <span className="tabular-nums">{formatINR(calculated.cgstAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 text-[9px]">
                  <span>SGST ({calculated.sgstRate}%):</span>
                  <span className="tabular-nums">{formatINR(calculated.sgstAmount)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-neutral-600 text-[9px]">
                <span>IGST ({calculated.igstRate}%):</span>
                <span className="tabular-nums">{formatINR(calculated.igstAmount)}</span>
              </div>
            )}
            {calculated.isTaxInclusive && (
              <p className="text-[8px] text-neutral-500 italic text-right">
                (Included in item prices)
              </p>
            )}
          </div>
        )}

        {calculated.roundOff !== 0 && (
          <div className="flex justify-between text-neutral-600 text-[9px]">
            <span>Round Off:</span>
            <span className="tabular-nums">
              {calculated.roundOff > 0 ? '+' : ''}
              {formatINR(calculated.roundOff)}
            </span>
          </div>
        )}
      </div>

      <div className={`${divider} my-2`}></div>

      {/* Grand Total */}
      <div className="flex justify-between items-center py-1">
        <span className="text-xs font-bold uppercase tracking-wide">GRAND TOTAL</span>
        <span className={`${fontScale.total} tabular-nums`}>
          {formatINR(calculated.grandTotal)}
        </span>
      </div>
      <div className={`${divider} my-3`}></div>

      {/* Footer Note */}
      <div className="text-center text-[9px] text-neutral-500 space-y-1">
        <p className="font-medium text-neutral-800">
          {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you for your visit!'}
        </p>
        <p className="text-[8px] text-neutral-400">Software by RestoBill</p>
      </div>
    </div>
  );
};
