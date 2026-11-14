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
import { fontPx, getFontSizeScale, getVariantStyles, ruleCss, showFssaiLine, showGstLine } from './templateUtils';
import { billFontProps } from '../../utils/receiptFonts';
import { OrderedBlocks } from './OrderedBlocks';

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
  const rule = ruleCss(style.dividerStyle);

  const headerAlignClass = style.headerAlignment === 'left' ? 'text-left' : 'text-center';
  const chosenFont = billFontProps(style.fontFamily);

  return (
    <div
      className={`w-[320px] bg-white text-black p-5 font-mono leading-tight select-none ${chosenFont.className}`}
      style={{ fontSize: fontPx(style.fontSize), ...chosenFont.style }}
    >
      <OrderedBlocks
        order={style.layoutOrder}
        blocks={{
          logo: (
            <div className={`mb-2 ${headerAlignClass}`}>
              {style.showLogo && restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="inline-block h-16 w-auto max-w-[180px] object-contain"
                />
              )}
            </div>
          ),
          header: (
      <>
      <div className={`mb-3 ${headerAlignClass}`}>
        <h1 className={`${fontScale.title} ${variant.headerWeight} tracking-tight`}>
          {restaurant.name || 'RESTAURANT NAME'}
        </h1>
        {restaurant.address && (
          <p className="whitespace-pre-line text-[0.9em] mt-1">
            {restaurant.address}
          </p>
        )}
        {restaurant.phone && (
          <p className="text-[0.9em] mt-0.5">Ph: {restaurant.phone}</p>
        )}
        {showGstLine(style, restaurant) && (
          <p className="text-[0.9em] font-semibold mt-0.5">
            GSTIN: {restaurant.gstin}
          </p>
        )}
        {showFssaiLine(style, restaurant) && (
          <p className="text-[0.9em] mt-0.5">FSSAI: {restaurant.fssai}</p>
        )}
      </div>

      <div className="my-2" style={rule}></div>
      </>
          ),
          details: (
      <>
      <div className="space-y-0.5 text-[0.9em] mb-2">
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
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{details.cashier}</span>
          </div>
        )}
      </div>

      <div className="my-2" style={rule}></div>
      </>
          ),
          items: (
      <>
      <table className="w-full text-[0.9em] mb-2">
        <thead>
          <tr className={variant.tableHeadBg} style={{ borderBottom: `1px ${style.dividerStyle} #000000`, backgroundColor: '#ffffff' }}>
            <th className="bg-white py-1 text-left font-bold w-[50%]">ITEM</th>
            <th className="bg-white py-1 text-center font-bold w-[15%]">QTY</th>
            <th className="bg-white py-1 text-right font-bold w-[17%]">RATE</th>
            <th className="bg-white py-1 text-right font-bold w-[18%]">AMT</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || index}>
              <td className="py-1 text-left align-top pr-1">
                <span className="font-medium block leading-tight">
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

      <div className="my-2" style={rule}></div>
      </>
          ),
          totals: (
      <>
      <div className="ml-auto grid w-max max-w-full grid-cols-[auto_auto] gap-x-3 gap-y-1 text-[0.9em] mb-2">
        <span className="text-right">Total Qty:</span>
        <span className="text-right font-semibold tabular-nums">{calculated.totalQuantity}</span>
        <span className="text-right">Subtotal:</span>
        <span className="text-right font-semibold tabular-nums">{formatINR(calculated.grossAmount)}</span>

        {calculated.discountAmount > 0 && (
          <>
            <span className="text-right">
              Discount{' '}
              {calculated.discountType === 'percentage' ? `(${calculated.discountValue}%)` : ''}:
            </span>
            <span className="text-right tabular-nums font-semibold">
              -{formatINR(calculated.discountAmount)}
            </span>
          </>
        )}

        {gst.enabled && calculated.totalTax > 0 && gst.taxType === 'intrastate' && (
          <>
            <span className="text-right text-[0.82em]">CGST ({calculated.cgstRate}%):</span>
            <span className="text-right text-[0.82em] tabular-nums">{formatINR(calculated.cgstAmount)}</span>
            <span className="text-right text-[0.82em]">SGST ({calculated.sgstRate}%):</span>
            <span className="text-right text-[0.82em] tabular-nums">{formatINR(calculated.sgstAmount)}</span>
          </>
        )}
        {gst.enabled && calculated.totalTax > 0 && gst.taxType !== 'intrastate' && (
          <>
            <span className="text-right text-[0.82em]">IGST ({calculated.igstRate}%):</span>
            <span className="text-right text-[0.82em] tabular-nums">{formatINR(calculated.igstAmount)}</span>
          </>
        )}
        {gst.enabled && calculated.totalTax > 0 && calculated.isTaxInclusive && (
          <p className="col-span-2 text-[0.75em] italic text-right">
            (Included in item prices)
          </p>
        )}

        {calculated.roundOff !== 0 && (
          <>
            <span className="text-right text-[0.82em]">Round Off:</span>
            <span className="text-right text-[0.82em] tabular-nums">
              {calculated.roundOff > 0 ? '+' : ''}
              {formatINR(calculated.roundOff)}
            </span>
          </>
        )}
      </div>

      <div className="my-2" style={rule}></div>

      {/* Grand Total */}
      <div className="flex justify-between items-center py-1">
        <span className="text-xs font-bold uppercase tracking-wide">GRAND TOTAL</span>
        <span className={`${fontScale.total} tabular-nums`}>
          {formatINR(calculated.grandTotal)}
        </span>
      </div>
      <div className="my-3" style={rule}></div>
      </>
          ),
          footer: (
      <div className="text-center text-[0.82em] space-y-1">
        <p className="font-medium">
          {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you for your visit!'}
        </p>
        
      </div>
          ),
        }}
      />
    </div>
  );
};
