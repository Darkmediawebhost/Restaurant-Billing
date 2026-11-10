import React, { useState, useEffect } from 'react';
import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  TemplateId,
  DiscountType,
  CalculatedBill,
} from '../types/billing';
import { RestaurantDetailsForm } from './RestaurantDetailsForm';
import { BillDetailsForm } from './BillDetailsForm';
import { ItemTable } from './ItemTable';
import { GSTSettings } from './GSTSettings';
import { BillSummary } from './BillSummary';
import { BillStyleSelector } from './BillStyleSelector';
import { TemplateSelector } from './TemplateSelector';
import { ReceiptPreview } from './ReceiptPreview';
import {
  Smartphone,
  Monitor,
  Download,
  Plus,
  RotateCcw,
  Save,
  Wifi,
  Battery,
  FileText,
  Eye,
  Store,
  Palette,
  Maximize2,
  Minimize2,
  Check,
  ArrowLeft,
  X,
} from 'lucide-react';

interface MobileAppCloneProps {
  restaurant: RestaurantInfo;
  setRestaurant: (val: RestaurantInfo) => void;
  onSaveRestaurantDefault: () => void;
  details: BillDetails;
  setDetails: React.Dispatch<React.SetStateAction<BillDetails>>;
  onRegenerateBillNumber: () => void;
  useRandomSuffix: boolean;
  onToggleRandomSuffix: (val: boolean) => void;
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
  gst: GSTConfig;
  setGst: React.Dispatch<React.SetStateAction<GSTConfig>>;
  discountType: DiscountType;
  setDiscountType: (val: DiscountType) => void;
  discountValue: number;
  setDiscountValue: (val: number) => void;
  style: BillStyle;
  setStyle: React.Dispatch<React.SetStateAction<BillStyle>>;
  templateId: TemplateId;
  setTemplateId: (val: TemplateId) => void;
  calculated: CalculatedBill;
  onNewBill: () => void;
  onResetBill: () => void;
  onSaveDraft: () => void;
  onExitMobile: () => void;
  onOpenInstallModal: () => void;
}

export const MobileAppClone: React.FC<MobileAppCloneProps> = ({
  restaurant,
  setRestaurant,
  onSaveRestaurantDefault,
  details,
  setDetails,
  onRegenerateBillNumber,
  useRandomSuffix,
  onToggleRandomSuffix,
  items,
  setItems,
  gst,
  setGst,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  style,
  setStyle,
  templateId,
  setTemplateId,
  calculated,
  onNewBill,
  onResetBill,
  onSaveDraft,
  onExitMobile,
  onOpenInstallModal,
}) => {
  // Mobile app active tab
  const [activeTab, setActiveTab] = useState<'bill' | 'preview' | 'store' | 'style'>('bill');
  
  // Phone container display style: 'frame' (phone mockup) vs 'full' (full mobile view)
  const [viewMode, setViewMode] = useState<'frame' | 'full'>('frame');

  // Live time for status bar
  const [timeString, setTimeString] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeString(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-start pb-8">
      {/* Top Mobile Clone Control Bar */}
      <div className="w-full bg-neutral-950 border-b border-neutral-800 px-4 py-2.5 sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Mobile App Mode</span>
            </div>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              (Live Mobile App Clone)
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              type="button"
              onClick={() => setViewMode(v => v === 'frame' ? 'full' : 'frame')}
              title={viewMode === 'frame' ? 'Expand to Full Width' : 'Show Phone Frame'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
            >
              {viewMode === 'frame' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Full View</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Phone Frame</span>
                </>
              )}
            </button>

            {/* Download / Install App Modal Trigger */}
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>

            {/* Exit to Desktop */}
            <button
              type="button"
              onClick={onExitMobile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors cursor-pointer border border-neutral-700"
            >
              <Monitor className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Desktop Mode</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Container */}
      <div className={`w-full flex justify-center py-4 sm:py-6 px-2 sm:px-4 ${viewMode === 'full' ? 'max-w-2xl' : ''}`}>
        {/* Phone Mockup Frame or Full Mobile View */}
        <div
          className={`relative bg-neutral-50 text-neutral-900 flex flex-col shadow-2xl transition-all duration-300 ${
            viewMode === 'frame'
              ? 'w-full max-w-[420px] rounded-[44px] ring-12 ring-neutral-800 border-[6px] border-neutral-950 min-h-[820px] max-h-[92vh] overflow-hidden'
              : 'w-full max-w-xl rounded-2xl border border-neutral-300 min-h-[800px] overflow-hidden'
          }`}
        >
          {/* Phone Hardware Top: Dynamic Island & Status Bar (Frame Mode) */}
          <div className="bg-neutral-950 text-white px-6 pt-3 pb-2 shrink-0 select-none">
            {/* Dynamic Island / Speaker Pill */}
            {viewMode === 'frame' && (
              <div className="flex justify-center -mt-1 mb-1">
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-3 border border-neutral-800 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-700"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Status Bar: Time & Indicators */}
            <div className="flex items-center justify-between text-[11px] font-semibold tracking-tight text-neutral-300">
              <span>{timeString}</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">5G</span>
                <div className="flex items-center gap-0.5">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px]">98%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Header */}
          <div className="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RB
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-950 leading-tight">RestoBill</div>
                <div className="text-[10px] font-mono text-neutral-500 leading-tight">{details.billNumber}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onSaveDraft}
                title="Save draft"
                className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onNewBill}
                title="New Bill"
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-950 text-white text-[11px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-header Tab Strip for Mobile App */}
          <div className="bg-neutral-100 border-b border-neutral-200 p-1 flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('bill')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bill'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bill Items ({items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Receipt (₹{calculated.grandTotal})</span>
            </button>
          </div>

          {/* Scrollable Mobile App Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-[#FAFAFA]">
            {activeTab === 'bill' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Bill Details Form */}
                <BillDetailsForm
                  details={details}
                  onChange={setDetails}
                  onRegenerateBillNumber={onRegenerateBillNumber}
                  useRandomSuffix={useRandomSuffix}
                  onToggleRandomSuffix={onToggleRandomSuffix}
                />

                {/* Items Table */}
                <ItemTable items={items} onChange={setItems} />

                {/* Bill Summary */}
                <BillSummary
                  calculated={calculated}
                  discountType={discountType}
                  discountValue={discountValue}
                  onDiscountTypeChange={setDiscountType}
                  onDiscountValueChange={setDiscountValue}
                  paymentMethod={details.paymentMethod}
                  onPaymentMethodChange={(val) => setDetails((prev) => ({ ...prev, paymentMethod: val }))}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <ReceiptPreview
                  restaurant={restaurant}
                  details={details}
                  items={items}
                  calculated={calculated}
                  discountType={discountType}
                  discountValue={discountValue}
                  style={style}
                  templateId={templateId}
                />
              </div>
            )}

            {activeTab === 'store' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <RestaurantDetailsForm
                  restaurant={restaurant}
                  onChange={setRestaurant}
                  onSaveDefault={onSaveRestaurantDefault}
                />
                <GSTSettings config={gst} onChange={setGst} />
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <TemplateSelector
                  selectedId={templateId}
                  onSelect={setTemplateId}
                  totalAmount={calculated.grandTotal}
                  diningType={details.diningType}
                />
                <BillStyleSelector
                  style={style}
                  onChange={setStyle}
                  diningType={details.diningType}
                />
              </div>
            )}
          </div>

          {/* Bottom Mobile App Navigation Dock */}
          <div className="bg-white border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around shrink-0 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab('bill')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'bill'
                  ? 'text-neutral-950 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-[10px]">Bill</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all relative ${
                activeTab === 'preview'
                  ? 'text-neutral-950 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px]">Receipt</span>
              <span className="absolute -top-1 right-0 text-[8px] px-1 py-0.2 bg-neutral-900 text-white rounded-full font-bold">
                ₹{calculated.grandTotal}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'store'
                  ? 'text-neutral-950 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[10px]">Store</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'style'
                  ? 'text-neutral-950 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span className="text-[10px]">Style</span>
            </button>
          </div>

          {/* Bottom Home Indicator Bar (Frame Mode) */}
          {viewMode === 'frame' && (
            <div className="bg-white pb-2 pt-1 flex justify-center shrink-0">
              <div className="w-28 h-1 bg-neutral-300 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
