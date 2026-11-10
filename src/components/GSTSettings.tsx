import React from 'react';
import { Receipt, Percent, Info } from 'lucide-react';
import { GSTConfig, TaxType, TaxTreatment } from '../types/billing';

interface GSTSettingsProps {
  gst: GSTConfig;
  onChange: (gst: GSTConfig) => void;
}

export const GSTSettings: React.FC<GSTSettingsProps> = ({ gst, onChange }) => {
  const commonRates = [5, 12, 18, 28];

  const handleToggle = (enabled: boolean) => {
    onChange({ ...gst, enabled });
  };

  const handleRateChange = (rate: number) => {
    onChange({ ...gst, rate: Math.max(0, rate) });
  };

  const handleTaxTypeChange = (taxType: TaxType) => {
    onChange({ ...gst, taxType });
  };

  const handleTaxTreatmentChange = (taxTreatment: TaxTreatment) => {
    onChange({ ...gst, taxTreatment });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
      {/* Header with Enable Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">GST & Tax Configuration</h3>
            <p className="text-xs text-neutral-500">CGST/SGST/IGST rates and inclusive/exclusive rules</p>
          </div>
        </div>

        {/* Custom Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={gst.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-950"></div>
          <span className="ml-2 text-xs font-semibold text-neutral-800">
            {gst.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {gst.enabled && (
        <div className="space-y-4 pt-1">
          {/* Rate Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-800 block">
              GST Tax Rate (%)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {commonRates.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRateChange(r)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    gst.rate === r
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {r}% {r === 5 && <span className="text-[10px] opacity-75">(Standard Food)</span>}
                </button>
              ))}

              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-400">Custom:</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={gst.rate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs text-center font-mono bg-neutral-50 border border-neutral-200 rounded-md focus:ring-1 focus:ring-neutral-900"
                />
                <span className="text-xs text-neutral-500 font-mono">%</span>
              </div>
            </div>
          </div>

          {/* Tax Type & Tax Treatment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            {/* Intrastate vs Interstate */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800">Transaction Type</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleTaxTypeChange('intrastate')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center ${
                    gst.taxType === 'intrastate'
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  Intrastate (CGST+SGST)
                </button>
                <button
                  type="button"
                  onClick={() => handleTaxTypeChange('interstate')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center ${
                    gst.taxType === 'interstate'
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  Interstate (IGST)
                </button>
              </div>
              <p className="text-[10px] text-neutral-500">
                {gst.taxType === 'intrastate'
                  ? `Split into CGST (${gst.rate / 2}%) and SGST (${gst.rate / 2}%)`
                  : `Full rate applied as IGST (${gst.rate}%)`}
              </p>
            </div>

            {/* Tax Treatment: Exclusive vs Inclusive */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800">Pricing Treatment</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleTaxTreatmentChange('exclusive')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center ${
                    gst.taxTreatment === 'exclusive'
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  Tax Exclusive (+Tax)
                </button>
                <button
                  type="button"
                  onClick={() => handleTaxTreatmentChange('inclusive')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center ${
                    gst.taxTreatment === 'inclusive'
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  Tax Inclusive (MRP)
                </button>
              </div>
              <p className="text-[10px] text-neutral-500">
                {gst.taxTreatment === 'exclusive'
                  ? 'Tax is computed and added on top of item prices'
                  : 'Menu prices already include GST; breakdown is extracted'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
