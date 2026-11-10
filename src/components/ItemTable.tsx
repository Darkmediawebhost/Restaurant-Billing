import React from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { BillItem } from '../types/billing';
import { ItemRow } from './ItemRow';

interface ItemTableProps {
  items: BillItem[];
  onChange: (items: BillItem[]) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({ items, onChange }) => {
  const handleAddItem = (name = '', unitPrice = 0, quantity = 1) => {
    const newItem: BillItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      quantity,
      unitPrice,
      amount: quantity * unitPrice,
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index: number, updated: BillItem) => {
    const copy = [...items];
    copy[index] = updated;
    onChange(copy);
  };

  const handleRemoveItem = (index: number) => {
    const copy = items.filter((_, i) => i !== index);
    onChange(copy);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Food Items & Pricing</h3>
          <p className="text-xs text-neutral-500">
            {items.length} {items.length === 1 ? 'item' : 'items'} added
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleAddItem('', 0, 1)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-98 rounded-lg transition-all shadow-xs cursor-pointer min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Items Table */}
      {items.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-neutral-200 rounded-lg space-y-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-700">No items on this bill</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Click Add Item to start adding food items.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddItem('', 0, 1)}
            className="px-4 py-2 text-xs bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-medium transition-all active:scale-98 min-h-[40px] inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Item</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-2">Item Name</th>
                <th className="py-2.5 px-2 text-center w-20">Qty</th>
                <th className="py-2.5 px-2 text-right w-28">Price (₹)</th>
                <th className="py-2.5 px-3 text-right w-28">Amount</th>
                <th className="py-2.5 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 sm:divide-neutral-100">
              {items.map((item, index) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={(updated) => handleUpdateItem(index, updated)}
                  onRemove={() => handleRemoveItem(index)}
                />
              ))}
            </tbody>
          </table>

          {/* Additional Add Item button at bottom for convenience */}
          <div className="pt-3 flex justify-start">
            <button
              type="button"
              onClick={() => handleAddItem('', 0, 1)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors cursor-pointer min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Item</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
