import React, { useState, useEffect } from 'react';
import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  TemplateId,
  DiscountType,
  BillCalculations,
} from '../types/billing';
import { RestaurantDetailsForm } from './RestaurantDetailsForm';
import { BillDetailsForm } from './BillDetailsForm';
import { ItemTable } from './ItemTable';
import { GSTSettings } from './GSTSettings';
import { BillSummary } from './BillSummary';
import { BillStyleSelector } from './BillStyleSelector';
import { TemplateSelector } from './TemplateSelector';
import { ReceiptPreview } from './ReceiptPreview';
import { isIosDevice } from '../utils/appLaunch';
import {
  Smartphone,
  Monitor,
  Download,
  Plus,
  Save,
  Wifi,
  Battery,
  FileText,
  Eye,
  Store,
  Palette,
  Maximize2,
  Minimize2,
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
  calculated: BillCalculations;
  onNewBill: () => void;
  onResetBill: () => void;
  onSaveDraft: () => void;
  onExitMobile: () => void;
  onDownloadApp: () => void;
  onNotify: (message: string, type?: 'success' | 'info' | 'error') => void;
  launched: boolean;
  appInstalled: boolean;
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
  onDownloadApp,
  onNotify,
  launched,
  appInstalled,
}) => {
  // Mobile app active tab
  const [activeTab, setActiveTab] = useState<'bill' | 'preview' | 'store' | 'style'>('bill');
  const [showLaunchNote, setShowLaunchNote] = useState(launched);
  const ios = isIosDevice();

  useEffect(() => {
    if (!launched) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [launched]);

  // Phone container display style: 'frame' (phone mockup) vs 'full' (full mobile view)
  const [viewMode, setViewMode] = useState<'frame' | 'full'>(launched ? 'full' : 'frame');
  const showFrame = !launched && viewMode === 'frame';

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
    <div
      className={
        launched
          ? 'fixed inset-0 z-40 h-svh max-h-svh w-full bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden'
          : 'min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-start'
      }
    >
      {!launched && (
        <div className="w-full bg-neutral-950 border-b border-neutral-800 px-4 py-2.5 sticky top-0 z-50 shadow-md">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>App preview</span>
              </div>
              <span className="text-[11px] text-neutral-400 hidden sm:inline">Inside the browser</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode((v) => (v === 'frame' ? 'full' : 'frame'))}
                title={viewMode === 'frame' ? 'Expand to full width' : 'Show phone frame'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              >
                {viewMode === 'frame' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="hidden sm:inline">Full view</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="hidden sm:inline">Phone frame</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onDownloadApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open app</span>
              </button>

              <button
                type="button"
                onClick={onExitMobile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors cursor-pointer border border-neutral-700"
              >
                <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Desktop site</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          launched
            ? 'flex-1 min-h-0 w-full flex justify-center'
            : `w-full flex justify-center py-4 sm:py-6 px-2 sm:px-4 ${viewMode === 'full' ? 'max-w-2xl' : ''}`
        }
      >
        <div
          className={`relative bg-neutral-50 text-neutral-900 flex flex-col shadow-2xl transition-all duration-300 ${
            launched
              ? 'w-full h-full min-h-0 overflow-hidden'
              : showFrame
                ? 'w-full max-w-[420px] h-[min(860px,calc(100dvh-88px))] rounded-[44px] ring-12 ring-neutral-800 border-[6px] border-neutral-950 overflow-hidden'
                : 'w-full max-w-xl h-[min(860px,calc(100dvh-88px))] rounded-2xl border border-neutral-300 overflow-hidden'
          }`}
        >
          <div className="bg-neutral-950 text-white px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 shrink-0 select-none">
            {showFrame && (
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
                {showFrame ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="flex items-center gap-0.5">
                      <Battery className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px]">98%</span>
                    </div>
                  </>
                ) : (
                  <span className="text-[10px] font-bold tracking-wide text-emerald-300">RestoBill</span>
                )}
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
              {launched && (
                <button
                  type="button"
                  onClick={onExitMobile}
                  title="Back to the website"
                  className="px-2 py-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg"
                >
                  Site
                </button>
              )}
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

          {launched && showLaunchNote && (
            <div className="bg-emerald-600 text-white px-3 py-2 flex items-start justify-between gap-3 shrink-0">
              <p className="text-[11px] leading-snug font-medium">
                {ios
                  ? 'App clone is open. To save the icon: tap Share (square with arrow), then Add to Home Screen.'
                  : appInstalled
                    ? 'Installed. Open RestoBill from your home screen next time.'
                    : 'App is open. Use the browser menu → Install app, so it does not open as a website.'}
              </p>
              <button
                type="button"
                onClick={() => setShowLaunchNote(false)}
                className="text-[11px] font-bold underline shrink-0"
              >
                Hide
              </button>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 bg-[#FAFAFA] [-webkit-overflow-scrolling:touch]">
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
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <ReceiptPreview
                  restaurant={restaurant}
                  details={details}
                  items={items}
                  gst={gst}
                  style={style}
                  templateId={templateId}
                  calculated={calculated}
                  onNewBill={onNewBill}
                  onNotify={onNotify}
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
                <GSTSettings gst={gst} onChange={setGst} />
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <TemplateSelector selectedTemplate={templateId} onSelectTemplate={setTemplateId} />
                <BillStyleSelector style={style} onChange={setStyle} />
              </div>
            )}
          </div>

          {/* Bottom Mobile App Navigation Dock */}
          <div className="bg-white border-t border-neutral-200 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around shrink-0 shadow-lg">
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
              <span className="text-[10px]">₹{calculated.grandTotal}</span>
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
          {showFrame && (
            <div className="bg-white pb-2 pt-1 flex justify-center shrink-0">
              <div className="w-28 h-1 bg-neutral-300 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
