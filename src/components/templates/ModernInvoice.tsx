import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { getFontSizeScale, getVariantStyles } from './templateUtils';
import { OrderedBlocks } from './OrderedBlocks';

export const ModernInvoice: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => {
  const fontScale = getFontSizeScale(style.fontSize);
  const variant = getVariantStyles(style.styleVariant);

  return (
    <div className="w-[520px] bg-white text-neutral-900 p-8 shadow-sm font-sans text-xs select-none">
      <OrderedBlocks
        order={style.layoutOrder}
        blocks={{
          logo: (
            <div className="mb-4">
              {style.showLogo && restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="block h-16 w-auto max-w-[180px] object-contain"
                />
              )}
            </div>
          ),
          header: (
      <div className="flex items-start justify-between border-b border-neutral-200 pb-5 mb-5">
        <div className="max-w-[65%]">
          <h1 className={`text-xl font-bold tracking-tight text-neutral-950 ${variant.headerWeight}`}>
            {restaurant.name || 'Restaurant Name'}
          </h1>
          {restaurant.address && (
            <p className="whitespace-pre-line text-neutral-500 text-[11px] mt-1 leading-relaxed">
              {restaurant.address}
            </p>
          )}
          <div className="flex flex-wrap gap-x-3 text-[10px] text-neutral-600 mt-2">
            {restaurant.phone && <span>Ph: {restaurant.phone}</span>}
            {restaurant.email && <span>Email: {restaurant.email}</span>}
          </div>
          {style.showGstin && restaurant.gstin && (
            <p className="text-[10px] font-medium text-neutral-800 mt-1">
              GSTIN: <span className="font-mono">{restaurant.gstin}</span>
            </p>
          )}
          {style.showFssai && restaurant.fssai && (
            <p className="text-[10px] text-neutral-500">
              FSSAI Lic: <span className="font-mono">{restaurant.fssai}</span>
            </p>
          )}
        </div>

        {/* Invoice Meta Box */}
        <div className="text-right">
          <div className="inline-block px-3 py-1 bg-neutral-100 rounded text-[10px] font-bold uppercase tracking-wider text-neutral-800 mb-2">
            TAX INVOICE
          </div>
          <div className="text-sm font-bold text-neutral-950 font-mono">
            {details.billNumber}
          </div>
          <div className="text-[11px] text-neutral-600 mt-1">Date: {details.date}</div>
          {style.showBillTime && details.time && (
            <div className="text-[11px] text-neutral-500">Time: {details.time}</div>
          )}
          <div className="text-[11px] font-semibold text-neutral-800 mt-1 uppercase">
            {details.diningType.replace('_', ' ')}
            {details.diningType === 'dine_in' && details.tableNumber && ` · Table ${details.tableNumber}`}
          </div>
        </div>
      </div>

          ),
          details: (
      <>
      {(details.customerName || details.customerPhone || details.cashier) && (
        <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-lg mb-5 text-[11px]">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">
              Billed To
            </span>
            <div className="font-semibold text-neutral-900">
              {details.customerName || 'Walk-in Guest'}
            </div>
            {details.customerPhone && (
              <div className="text-neutral-500 font-mono text-[10px]">{details.customerPhone}</div>
            )}
          </div>
          <div className="text-right">
            {style.showCashier && details.cashier && (
              <>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">
                  Biller / Cashier
                </span>
                <div className="text-neutral-700">{details.cashier}</div>
              </>
            )}
          </div>
        </div>
      )}
      </>
          ),
          items: (
      <table className="w-full text-left text-xs mb-5">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500 text-[10px] uppercase font-semibold tracking-wider">
            <th className="py-2 pl-2 w-8">#</th>
            <th className="py-2">Item Description</th>
            <th className="py-2 text-center w-14">Qty</th>
            <th className="py-2 text-right w-20">Unit Price</th>
            <th className="py-2 pr-2 text-right w-24">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {items.map((item, idx) => (
            <tr key={item.id || idx} className="hover:bg-neutral-50/50">
              <td className="py-2.5 pl-2 text-neutral-400 font-mono text-[10px]">{idx + 1}</td>
              <td className="py-2.5 font-medium text-neutral-900">{item.name}</td>
              <td className="py-2.5 text-center font-mono text-neutral-700">{item.quantity}</td>
              <td className="py-2.5 text-right font-mono text-neutral-600">
                {formatINR(item.unitPrice, false)}
              </td>
              <td className="py-2.5 pr-2 text-right font-mono font-semibold text-neutral-950">
                {formatINR(item.amount, false)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

          ),
          totals: (
      <div className="border-t border-neutral-200 pt-4 flex justify-between items-start">
        <div className="max-w-[48%] text-[10px] text-neutral-500 space-y-1">
          <p className="font-medium text-neutral-800">
            Total Items: {items.length} · Total Qty: {calculated.totalQuantity}
          </p>
          {gst.enabled && (
            <p className="text-[10px]">
              Tax Regime: {gst.taxType === 'intrastate' ? 'Intrastate (CGST+SGST)' : 'Interstate (IGST)'}
              {calculated.isTaxInclusive ? ' (Tax Inclusive)' : ' (Tax Exclusive)'}
            </p>
          )}
        </div>

        <div className="w-[45%] space-y-1.5 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal:</span>
            <span className="font-mono text-neutral-900">{formatINR(calculated.grossAmount)}</span>
          </div>

          {calculated.discountAmount > 0 && (
            <div className="flex justify-between text-neutral-800">
              <span>
                Discount{' '}
                {calculated.discountType === 'percentage' ? `(${calculated.discountValue}%)` : ''}:
              </span>
              <span className="font-mono font-medium">-{formatINR(calculated.discountAmount)}</span>
            </div>
          )}

          {gst.enabled && calculated.totalTax > 0 && (
            <>
              {gst.taxType === 'intrastate' ? (
                <>
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>CGST ({calculated.cgstRate}%):</span>
                    <span className="font-mono">{formatINR(calculated.cgstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>SGST ({calculated.sgstRate}%):</span>
                    <span className="font-mono">{formatINR(calculated.sgstAmount)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>IGST ({calculated.igstRate}%):</span>
                  <span className="font-mono">{formatINR(calculated.igstAmount)}</span>
                </div>
              )}
            </>
          )}

          {calculated.roundOff !== 0 && (
            <div className="flex justify-between text-neutral-500 text-[11px]">
              <span>Round off:</span>
              <span className="font-mono">{formatINR(calculated.roundOff)}</span>
            </div>
          )}

          <div className="border-t-2 border-neutral-950 pt-2 flex justify-between items-center text-sm font-bold text-neutral-950">
            <span>GRAND TOTAL:</span>
            <span className="font-mono text-base">{formatINR(calculated.grandTotal)}</span>
          </div>
        </div>
      </div>
          ),
          footer: (
      <p className="italic pt-4 text-[10px] text-neutral-500">
        {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you for your patronage!'}
      </p>
          ),
        }}
      />
    </div>
  );
};
