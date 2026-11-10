import React from 'react';
import { Calculator, Tag } from 'lucide-react';
import { BillCalculations, DiscountType } from '../types/billing';
import { formatINR } from '../utils/calculations';

interface BillSummaryProps {
  calculated: BillCalculations;
  discountType: DiscountType;
  discountValue: number;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (val: number) => void;
}

export const BillSummary: React.FC<BillSummaryProps> = ({
  calculated,
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Calculations & Discount</h3>
          <p className="text-xs text-neutral-500">Totals breakdown and round off</p>
        </div>
      </div>

      {/* Discount Selector */}
      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            <span>Apply Discount</span>
          </label>
          <div className="flex items-center gap-1 p-0.5 bg-neutral-200 rounded-md">
            <button
              type="button"
              onClick={() => onDiscountTypeChange('percentage')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                discountType === 'percentage'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              % Percent
            </button>
            <button
              type="button"
              onClick={() => onDiscountTypeChange('flat')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                discountType === 'flat'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ₹ Flat
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-xs font-mono text-neutral-400">
              {discountType === 'percentage' ? '%' : '₹'}
            </span>
            <input
              type="number"
              min={0}
              max={discountType === 'percentage' ? 100 : calculated.grossAmount}
              value={discountValue || ''}
              onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full pl-7 pr-3 py-1.5 text-xs font-mono bg-white border border-neutral-200 rounded-md focus:ring-1 focus:ring-neutral-900"
            />
          </div>
          {calculated.discountAmount > 0 && (
            <span className="text-xs font-mono text-neutral-600">
              Discount Amount: <strong className="text-neutral-900">-{formatINR(calculated.discountAmount)}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Numerical Line Items */}
      <div className="space-y-2 text-xs pt-1">
        <div className="flex justify-between text-neutral-600">
          <span>Total Food Quantity:</span>
          <span className="font-mono font-medium text-neutral-900 tabular-nums">
            {calculated.totalQuantity} items
          </span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Subtotal (Gross):</span>
          <span className="font-mono font-semibold text-neutral-900 tabular-nums">
            {formatINR(calculated.grossAmount)}
          </span>
        </div>

        {calculated.discountAmount > 0 && (
          <div className="flex justify-between text-neutral-700">
            <span>
              Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Flat'}):
            </span>
            <span className="font-mono text-neutral-900 tabular-nums">
              -{formatINR(calculated.discountAmount)}
            </span>
          </div>
        )}

        {calculated.totalTax > 0 && (
          <div className="space-y-1 pt-1 border-t border-neutral-100">
            <div className="flex justify-between text-neutral-600">
              <span>
                GST Tax ({calculated.taxRate}%
                {calculated.taxType === 'intrastate' ? ' Intrastate' : ' Interstate'}):
              </span>
              <span className="font-mono text-neutral-900 tabular-nums">
                {formatINR(calculated.totalTax)}
              </span>
            </div>

            {calculated.taxType === 'intrastate' ? (
              <div className="pl-3 text-[11px] text-neutral-500 space-y-0.5">
                <div className="flex justify-between">
                  <span>CGST ({calculated.cgstRate}%):</span>
                  <span className="font-mono tabular-nums">{formatINR(calculated.cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST ({calculated.sgstRate}%):</span>
                  <span className="font-mono tabular-nums">{formatINR(calculated.sgstAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="pl-3 text-[11px] text-neutral-500">
                <div className="flex justify-between">
                  <span>IGST ({calculated.igstRate}%):</span>
                  <span className="font-mono tabular-nums">{formatINR(calculated.igstAmount)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {calculated.roundOff !== 0 && (
          <div className="flex justify-between text-neutral-500 text-[11px]">
            <span>Round off:</span>
            <span className="font-mono tabular-nums">
              {calculated.roundOff > 0 ? '+' : ''}
              {formatINR(calculated.roundOff)}
            </span>
          </div>
        )}

        {/* Grand Total Bar */}
        <div className="pt-3 border-t-2 border-neutral-900 flex justify-between items-center text-sm font-bold text-neutral-950">
          <span>GRAND TOTAL:</span>
          <span className="font-mono text-xl tabular-nums tracking-tight">
            {formatINR(calculated.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
