import React from 'react';
import { LayoutTemplate, Printer, FileText, Check } from 'lucide-react';
import { TemplateId } from '../types/billing';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (id: TemplateId) => void;
}

interface TemplateOption {
  id: TemplateId;
  name: string;
  paperType: string;
  widthLabel: string;
  description: string;
  isThermal: boolean;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  const templates: TemplateOption[] = [
    {
      id: 'shop_slip_80mm',
      name: 'Shop Slip',
      paperType: '80mm Roll',
      widthLabel: 'Counter POS',
      description: 'Counter slip: shop lines, Name, Date with Dine In, then Item, Qty, Price and Amount.',
      isThermal: true,
    },
    {
      id: 'simple_list_80mm',
      name: 'Simple List',
      paperType: '80mm Roll',
      widthLabel: 'Easy bill',
      description: 'A short list. Quantity and item on the left, amount on the right.',
      isThermal: true,
    },
    {
      id: 'cash_memo_80mm',
      name: 'Cash Memo',
      paperType: '80mm Roll',
      widthLabel: 'Memo',
      description: 'A plain cash memo with name, date, item, qty and amount.',
      isThermal: true,
    },
    {
      id: 'short_slip_58mm',
      name: 'Short Slip',
      paperType: '58mm Roll',
      widthLabel: 'Small roll',
      description: 'The smallest bill. Name, a few item lines, and the total.',
      isThermal: true,
    },
    {
      id: 'classic_thermal_80mm',
      name: 'Classic Thermal',
      paperType: '80mm Roll',
      widthLabel: 'POS Roll',
      description: 'Standard 80mm thermal receipt with dashed rules and bold totals.',
      isThermal: true,
    },
    {
      id: 'compact_thermal_58mm',
      name: 'Compact Thermal',
      paperType: '58mm Roll',
      widthLabel: 'Narrow POS',
      description: 'Ultra-compact layout for small portable Bluetooth & 58mm printers.',
      isThermal: true,
    },
    {
      id: 'modern_invoice_a5',
      name: 'Modern Invoice',
      paperType: 'A5 Sheet',
      widthLabel: '148 × 210 mm',
      description: 'A clean invoice with a little more space around the items.',
      isThermal: false,
    },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
          <LayoutTemplate className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Receipt & Invoice Templates</h3>
          <p className="text-xs text-neutral-500">Choose between POS thermal rolls or standard paper invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100/80 text-neutral-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {tpl.isThermal ? (
                      <Printer
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      />
                    ) : (
                      <FileText
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      />
                    )}
                    <span className="font-semibold text-xs tracking-tight">{tpl.name}</span>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-white text-neutral-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p
                  className={`text-[11px] leading-relaxed mb-3 ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-current/10">
                <span className="font-medium">{tpl.paperType}</span>
                <span className="font-mono opacity-80">{tpl.widthLabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
