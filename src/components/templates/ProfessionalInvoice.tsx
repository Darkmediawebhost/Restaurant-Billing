import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { getFontSizeScale, getVariantStyles } from './templateUtils';

export const ProfessionalInvoice: React.FC<TemplateProps> = ({
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
    <div className="w-[680px] bg-white text-neutral-900 p-10 font-sans text-xs select-none">
      {/* Formal Header Banner */}
      <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-6 mb-6">
        <div>
          {style.showLogo && restaurant.logoUrl && (
            <div className="mb-3">
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="max-h-16 max-w-[200px] object-contain grayscale"
              />
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight text-neutral-950 uppercase">
            {restaurant.name || 'RESTAURANT NAME'}
          </h1>
          {restaurant.address && (
            <p className="whitespace-pre-line text-neutral-600 text-xs mt-1 leading-relaxed max-w-sm">
              {restaurant.address}
            </p>
          )}
          <div className="flex gap-4 text-[11px] text-neutral-600 mt-2 font-mono">
            {restaurant.phone && <span>Tel: {restaurant.phone}</span>}
            {restaurant.email && <span>{restaurant.email}</span>}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-neutral-900 tracking-tight mb-2">
            TAX INVOICE
          </div>
          <div className="bg-neutral-100 p-3 rounded border border-neutral-200 text-right space-y-1 text-[11px]">
            <div>
              <span className="text-neutral-500">Invoice No:</span>{' '}
              <span className="font-bold font-mono text-neutral-900">{details.billNumber}</span>
            </div>
            <div>
              <span className="text-neutral-500">Invoice Date:</span>{' '}
              <span className="font-medium text-neutral-800">{details.date}</span>
            </div>
            {style.showBillTime && details.time && (
              <div>
                <span className="text-neutral-500">Time:</span>{' '}
                <span className="font-mono text-neutral-800">{details.time}</span>
              </div>
            )}
            <div>
              <span className="text-neutral-500">Dining Type:</span>{' '}
              <span className="font-bold text-neutral-900 uppercase">
                {details.diningType.replace('_', ' ')}
              </span>
            </div>
            {details.diningType === 'dine_in' && details.tableNumber && (
              <div>
                <span className="text-neutral-500">Table Number:</span>{' '}
                <span className="font-bold text-neutral-900">{details.tableNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer & Tax Details Row */}
      <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-neutral-50 rounded border border-neutral-200 text-xs">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Customer Details
          </div>
          <div className="font-semibold text-neutral-900 text-sm">
            {details.customerName || 'Direct Guest'}
          </div>
          {details.customerPhone && (
            <div className="text-neutral-600 font-mono text-xs mt-0.5">
              Phone: {details.customerPhone}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Statutory & Operator
          </div>
          {style.showGstin && (
            <div className="text-neutral-800 text-[11px]">
              GSTIN: <span className="font-mono font-bold">{restaurant.gstin || 'N/A'}</span>
            </div>
          )}
          {style.showFssai && (
            <div className="text-neutral-700 text-[11px]">
              FSSAI Lic: <span className="font-mono">{restaurant.fssai || 'N/A'}</span>
            </div>
          )}
          {style.showCashier && details.cashier && (
            <div className="text-neutral-600 text-[11px] mt-1">
              Biller: <span className="font-medium text-neutral-900">{details.cashier}</span>
            </div>
          )}
        </div>
      </div>

      {/* Formal Detailed Items Table */}
      <table className="w-full text-left text-xs mb-6">
        <thead>
          <tr className="bg-neutral-900 text-white font-bold text-[10px] uppercase tracking-wider">
            <th className="py-2.5 px-3 w-10 text-center">S.No</th>
            <th className="py-2.5 px-3">Item Description</th>
            <th className="py-2.5 px-3 text-center w-16">Qty</th>
            <th className="py-2.5 px-3 text-right w-24">Rate (INR)</th>
            <th className="py-2.5 px-3 text-right w-28">Amount (INR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 border-b border-neutral-200">
          {items.map((item, idx) => (
            <tr key={item.id || idx} className="hover:bg-neutral-50/70">
              <td className="py-2.5 px-3 text-center font-mono text-neutral-500">{idx + 1}</td>
              <td className="py-2.5 px-3 font-semibold text-neutral-900">{item.name}</td>
              <td className="py-2.5 px-3 text-center font-mono text-neutral-700">
                {item.quantity}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-neutral-600">
                {formatINR(item.unitPrice, false)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-950">
                {formatINR(item.amount, false)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Calculation & Tax Breakdown Section */}
      <div className="flex justify-between items-start gap-8 mb-8">
        {/* Left side: Tax Breakdown Matrix */}
        <div className="w-[55%]">
          {gst.enabled && calculated.totalTax > 0 ? (
            <div className="border border-neutral-200 rounded p-3 bg-neutral-50 text-[11px]">
              <div className="font-bold text-neutral-900 mb-2 uppercase tracking-wide text-[10px]">
                GST Tax Summary
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-neutral-500 text-[10px] border-b border-neutral-200">
                    <th className="pb-1">Tax Type</th>
                    <th className="pb-1 text-right">Taxable Base</th>
                    <th className="pb-1 text-center">Rate</th>
                    <th className="pb-1 text-right">Tax Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-mono text-[10px]">
                  {gst.taxType === 'intrastate' ? (
                    <>
                      <tr>
                        <td className="py-1">CGST</td>
                        <td className="py-1 text-right">{formatINR(calculated.netTaxableAmount)}</td>
                        <td className="py-1 text-center">{calculated.cgstRate}%</td>
                        <td className="py-1 text-right font-semibold">
                          {formatINR(calculated.cgstAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1">SGST</td>
                        <td className="py-1 text-right">{formatINR(calculated.netTaxableAmount)}</td>
                        <td className="py-1 text-center">{calculated.sgstRate}%</td>
                        <td className="py-1 text-right font-semibold">
                          {formatINR(calculated.sgstAmount)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td className="py-1">IGST</td>
                      <td className="py-1 text-right">{formatINR(calculated.netTaxableAmount)}</td>
                      <td className="py-1 text-center">{calculated.igstRate}%</td>
                      <td className="py-1 text-right font-semibold">
                        {formatINR(calculated.igstAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-[11px] text-neutral-500 italic p-3 bg-neutral-50 rounded border border-neutral-200">
              Tax exemption / composite scheme applied.
            </div>
          )}

          <div className="mt-3 text-[10px] text-neutral-500 leading-relaxed">
            <span className="font-semibold text-neutral-700">Terms:</span> Goods once sold cannot
            be returned. This is a computer generated bill.
          </div>
        </div>

        {/* Right side: Final Sums */}
        <div className="w-[45%] bg-neutral-50 border border-neutral-200 rounded p-4 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal (Qty {calculated.totalQuantity}):</span>
            <span className="font-mono text-neutral-900 font-semibold">
              {formatINR(calculated.grossAmount)}
            </span>
          </div>

          {calculated.discountAmount > 0 && (
            <div className="flex justify-between text-neutral-800">
              <span>
                Discount{' '}
                {calculated.discountType === 'percentage' ? `(${calculated.discountValue}%)` : ''}:
              </span>
              <span className="font-mono font-semibold">-{formatINR(calculated.discountAmount)}</span>
            </div>
          )}

          {gst.enabled && (
            <div className="flex justify-between text-neutral-600">
              <span>Total GST ({calculated.taxRate}%):</span>
              <span className="font-mono">{formatINR(calculated.totalTax)}</span>
            </div>
          )}

          {calculated.roundOff !== 0 && (
            <div className="flex justify-between text-neutral-500 text-[11px]">
              <span>Round Off:</span>
              <span className="font-mono">{formatINR(calculated.roundOff)}</span>
            </div>
          )}

          <div className="border-t-2 border-neutral-900 pt-3 flex justify-between items-center text-sm font-bold text-neutral-950">
            <span className="uppercase">Grand Total:</span>
            <span className="font-mono text-lg">{formatINR(calculated.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Signature & Footer */}
      <div className="border-t border-neutral-200 pt-6 flex justify-between items-end text-neutral-600 text-xs">
        <div>
          <p className="font-semibold text-neutral-900">
            {restaurant.footerMessage?.trim() || style.footerMessage || 'Thank you for dining with us!'}
          </p>
          <p className="text-[10px] text-neutral-400 mt-1">Authorized Billing Signature</p>
        </div>
        <div className="text-right">
          <div className="w-40 border-b border-neutral-400 mb-1"></div>
          <span className="text-[10px] text-neutral-500">Authorized Signatory</span>
        </div>
      </div>
    </div>
  );
};
