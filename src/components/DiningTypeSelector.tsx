import React from 'react';
import { Utensils, ShoppingBag, Bike } from 'lucide-react';
import { DiningType } from '../types/billing';

interface DiningTypeSelectorProps {
  value: DiningType;
  onChange: (val: DiningType) => void;
}

export const DiningTypeSelector: React.FC<DiningTypeSelectorProps> = ({ value, onChange }) => {
  const options: { id: DiningType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dine_in', label: 'Dine In', icon: Utensils },
    { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery', icon: Bike },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              isActive
                ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
