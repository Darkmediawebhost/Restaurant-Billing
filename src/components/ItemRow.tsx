import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { BillItem } from '../types/billing';
import { formatINR } from '../utils/calculations';

interface ItemRowProps {
  item: BillItem;
  index: number;
  onUpdate: (updated: BillItem) => void;
  onRemove: () => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdate, onRemove }) => {
  const handleNameChange = (name: string) => {
    onUpdate({ ...item, name, amount: (item.quantity || 0) * (item.unitPrice || 0) });
  };

  const handleQtyChange = (qtyStr: string) => {
    const val = parseInt(qtyStr, 10);
    const qty = isNaN(val) ? 0 : Math.max(0, val);
    onUpdate({ ...item, quantity: qty, amount: qty * (item.unitPrice || 0) });
  };

  const stepQty = (delta: number) => {
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    onUpdate({ ...item, quantity: newQty, amount: newQty * (item.unitPrice || 0) });
  };

  const handlePriceChange = (priceStr: string) => {
    const val = parseFloat(priceStr);
    const unitPrice = isNaN(val) ? 0 : Math.max(0, val);
    onUpdate({ ...item, unitPrice, amount: (item.quantity || 0) * unitPrice });
  };

  return (
    <>
      {/* Desktop Table Row */}
      <tr className="hidden sm:table-row hover:bg-neutral-50/70 transition-colors group">
        <td className="py-2.5 px-3 text-neutral-400 font-mono text-xs w-10 text-center">
          {index + 1}
        </td>

        <td className="py-2.5 px-2">
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Item name (e.g. Chicken Biryani)"
            className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white font-medium"
          />
        </td>

        <td className="py-2.5 px-2 w-20 text-center">
          <input
            type="number"
            min={1}
            value={item.quantity || ''}
            onChange={(e) => handleQtyChange(e.target.value)}
            className="w-16 px-2 py-1.5 text-xs text-center font-mono bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
          />
        </td>

        <td className="py-2.5 px-2 w-28 text-right">
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-neutral-400 text-xs">₹</span>
            <input
              type="number"
              min={0}
              step="any"
              value={item.unitPrice || ''}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-6 pr-2 py-1.5 text-xs text-right font-mono bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
          </div>
        </td>

        <td className="py-2.5 px-3 text-right font-mono font-semibold text-neutral-900 text-xs w-28 tabular-nums">
          {formatINR(item.amount)}
        </td>

        <td className="py-2.5 px-2 w-10 text-center">
          <button
            type="button"
            onClick={onRemove}
            title="Remove item"
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>

      {/* Mobile Touch-Optimized Item Card */}
      <tr className="sm:hidden">
        <td colSpan={6} className="p-0 pb-3">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 shadow-2xs">
            {/* Row 1: Item Name & Remove */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-400 shrink-0">
                #{index + 1}
              </span>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Item name (e.g. Biryani)"
                className="flex-1 px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
              />
              <button
                type="button"
                onClick={onRemove}
                aria-label="Remove item"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Row 2: Stepper Qty, Unit Price, and Calculated Amount */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-200/60 text-xs">
              {/* Stepper Qty */}
              <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => stepQty(-1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center font-mono font-semibold text-neutral-900 tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => stepQty(1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Price Input */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-400 font-medium">@ ₹</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={item.unitPrice || ''}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0.00"
                  className="w-20 px-2 py-1.5 text-xs text-right font-mono bg-white border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              {/* Calculated Amount */}
              <div className="text-right">
                <span className="font-mono font-bold text-neutral-950 text-sm tabular-nums">
                  {formatINR(item.amount)}
                </span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};
