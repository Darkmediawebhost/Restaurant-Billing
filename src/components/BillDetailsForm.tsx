import React from 'react';
import { FileText, RefreshCw, Hash, Calendar, Clock, User, Phone } from 'lucide-react';
import { BillDetails, DiningType } from '../types/billing';
import { DiningTypeSelector } from './DiningTypeSelector';

interface BillDetailsFormProps {
  details: BillDetails;
  onChange: (details: BillDetails) => void;
  onRegenerateBillNumber: () => void;
  useRandomSuffix: boolean;
  onToggleRandomSuffix: (val: boolean) => void;
}

export const BillDetailsForm: React.FC<BillDetailsFormProps> = ({
  details,
  onChange,
  onRegenerateBillNumber,
  useRandomSuffix,
  onToggleRandomSuffix,
}) => {
  const handleFieldChange = (field: keyof BillDetails, value: any) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Bill & Customer Details</h3>
            <p className="text-xs text-neutral-500">Order metadata, table, and customer</p>
          </div>
        </div>

        {/* Bill Number indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg border border-neutral-200 font-mono text-xs font-bold text-neutral-950">
            <Hash className="w-3.5 h-3.5 text-neutral-500" />
            <span>{details.billNumber}</span>
          </div>
          <button
            type="button"
            onClick={onRegenerateBillNumber}
            title="Generate new sequential bill number"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 1: Bill Number, Date, Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800">Bill Number</label>
          <input
            type="text"
            value={details.billNumber}
            onChange={(e) => handleFieldChange('billNumber', e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-xs font-mono font-medium bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white min-h-[40px]"
          />
          <label className="flex items-center gap-1.5 text-[11px] text-neutral-500 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={useRandomSuffix}
              onChange={(e) => onToggleRandomSuffix(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
            />
            <span>Add random suffix (e.g. -A7B)</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Bill Date</span>
          </label>
          <input
            type="date"
            value={details.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white min-h-[40px]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Bill Time</span>
          </label>
          <input
            type="time"
            value={details.time}
            onChange={(e) => handleFieldChange('time', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white min-h-[40px]"
          />
        </div>
      </div>

      {/* Row 2: Dining Type & Table Number */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800">Dining Type</label>
          <DiningTypeSelector
            value={details.diningType}
            onChange={(val: DiningType) => handleFieldChange('diningType', val)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800">
            {details.diningType === 'dine_in' ? 'Table Number *' : 'Reference / Table'}
          </label>
          <input
            type="text"
            value={details.tableNumber}
            onChange={(e) => handleFieldChange('tableNumber', e.target.value)}
            placeholder={details.diningType === 'dine_in' ? 'e.g. T-04' : 'Optional note'}
            className={`w-full px-3 py-2 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-1 transition-all min-h-[40px] ${
              details.diningType === 'dine_in'
                ? 'border-neutral-300 font-semibold focus:ring-neutral-900 focus:bg-white'
                : 'border-neutral-200 text-neutral-500'
            }`}
          />
        </div>
      </div>

      {/* Row 3: Customer Information & Cashier */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span>Customer Name (Optional)</span>
          </label>
          <input
            type="text"
            value={details.customerName}
            onChange={(e) => handleFieldChange('customerName', e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white min-h-[40px]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-neutral-400" />
            <span>Customer Phone</span>
          </label>
          <input
            type="tel"
            value={details.customerPhone}
            onChange={(e) => handleFieldChange('customerPhone', e.target.value)}
            placeholder="+91 9876543210"
            className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white min-h-[40px]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800">Cashier / Biller</label>
          <input
            type="text"
            value={details.cashier}
            onChange={(e) => handleFieldChange('cashier', e.target.value)}
            placeholder="Counter 1 / Alex"
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white min-h-[40px]"
          />
        </div>
      </div>
    </div>
  );
};
