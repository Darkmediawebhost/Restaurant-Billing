import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  TemplateId,
  DiscountType,
} from './types/billing';
import { calculateBill } from './utils/calculations';
import {
  DEFAULT_RESTAURANT,
  DEFAULT_BILL_STYLE,
  DEFAULT_GST_CONFIG,
  DEFAULT_ITEMS,
  getStoredRestaurantInfo,
  saveStoredRestaurantInfo,
  getBillCounter,
  incrementBillCounter,
  formatBillNumber,
  getStoredDraft,
  saveDraft,
} from './utils/storage';
import { generateBillPDF, printReceiptIsolated } from './utils/pdfGenerator';
import { AppHeader } from './components/AppHeader';
import { RestaurantDetailsForm } from './components/RestaurantDetailsForm';
import { BillDetailsForm } from './components/BillDetailsForm';
import { ItemTable } from './components/ItemTable';
import { GSTSettings } from './components/GSTSettings';
import { BillSummary } from './components/BillSummary';
import { BillStyleSelector } from './components/BillStyleSelector';
import { TemplateSelector } from './components/TemplateSelector';
import { ReceiptPreview } from './components/ReceiptPreview';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MobileAppClone } from './components/MobileAppClone';
import { InstallAppModal } from './components/InstallAppModal';
import { ClassicThermal } from './components/templates/ClassicThermal';
import { CompactThermal } from './components/templates/CompactThermal';
import { ModernInvoice } from './components/templates/ModernInvoice';
import { ProfessionalInvoice } from './components/templates/ProfessionalInvoice';
import { ElegantMinimal } from './components/templates/ElegantMinimal';
import { RotateCcw, Save, Eye, FileText, Check, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Mobile specific view: 'editor' vs 'preview' (for split desktop fallback)
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Dedicated Mobile App Clone view mode
  const [isMobileAppCloneMode, setIsMobileAppCloneMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return true;
    }
    return false;
  });

  // PDF downloading state
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // PWA install prompt & modal
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  // Confirmation modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Capture beforeinstallprompt for PWA installation
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const notify = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Restaurant Details State
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(() => getStoredRestaurantInfo());

  // 2. Suffix flag
  const [useRandomSuffix, setUseRandomSuffix] = useState<boolean>(false);

  // 3. Bill Details State
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const [billCounter, setBillCounter] = useState<number>(() => getBillCounter());

  const [details, setDetails] = useState<BillDetails>(() => {
    const draft = getStoredDraft();
    if (draft?.billDetails) {
      return draft.billDetails;
    }
    return {
      billNumber: formatBillNumber(getBillCounter(), false),
      date: getTodayDate(),
      time: getCurrentTime(),
      diningType: 'dine_in',
      tableNumber: 'T-04',
      cashier: 'Counter 1 / Alex',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 9876543210',
      paymentMethod: 'UPI / QR',
    };
  });

  // 4. Food Items State
  const [items, setItems] = useState<BillItem[]>(() => {
    const draft = getStoredDraft();
    if (draft?.items && draft.items.length > 0) {
      return draft.items;
    }
    return DEFAULT_ITEMS;
  });

  // 5. GST Config State
  const [gst, setGst] = useState<GSTConfig>(() => {
    const draft = getStoredDraft();
    return draft?.gst || DEFAULT_GST_CONFIG;
  });

  // 6. Discount State
  const [discountType, setDiscountType] = useState<DiscountType>(() => {
    const draft = getStoredDraft();
    return draft?.discountType || 'percentage';
  });
  const [discountValue, setDiscountValue] = useState<number>(() => {
    const draft = getStoredDraft();
    return draft?.discountValue !== undefined ? draft.discountValue : 5;
  });

  // 7. Bill Style State
  const [style, setStyle] = useState<BillStyle>(() => {
    const draft = getStoredDraft();
    return draft?.style || DEFAULT_BILL_STYLE;
  });

  // 8. Template State
  const [templateId, setTemplateId] = useState<TemplateId>(() => {
    const draft = getStoredDraft();
    return draft?.templateId || 'classic_thermal_80mm';
  });

  // Calculations derived with precision
  const calculated = useMemo(() => {
    return calculateBill(items, discountType, discountValue, gst);
  }, [items, discountType, discountValue, gst]);

  // Auto-save draft on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft({
        billDetails: details,
        items,
        gst,
        style,
        templateId,
        discountType,
        discountValue,
        useRandomSuffix,
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [details, items, gst, style, templateId, discountType, discountValue, useRandomSuffix]);

  // Keyboard shortcuts: Ctrl+P to Print, Ctrl+S to save draft, Ctrl+D to Download PDF
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDownload();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveDraft({
          billDetails: details,
          items,
          gst,
          style,
          templateId,
          discountType,
          discountValue,
          useRandomSuffix,
        });
        notify('Draft bill saved to device', 'success');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [details, items, gst, style, templateId, discountType, discountValue, useRandomSuffix, notify]);

  // Actions
  const handleSaveRestaurantDefault = () => {
    saveStoredRestaurantInfo(restaurant);
    notify('Restaurant information saved as default', 'success');
  };

  const handleRegenerateBillNumber = () => {
    const nextNumber = formatBillNumber(billCounter, useRandomSuffix);
    setDetails((prev) => ({ ...prev, billNumber: nextNumber }));
    notify(`Bill number updated to ${nextNumber}`, 'info');
  };

  const handleToggleRandomSuffix = (val: boolean) => {
    setUseRandomSuffix(val);
    const updated = formatBillNumber(billCounter, val);
    setDetails((prev) => ({ ...prev, billNumber: updated }));
  };

  const handleNewBill = () => {
    const nextCounter = incrementBillCounter();
    setBillCounter(nextCounter);
    const newBillNo = formatBillNumber(nextCounter, useRandomSuffix);

    setDetails({
      billNumber: newBillNo,
      date: getTodayDate(),
      time: getCurrentTime(),
      diningType: 'dine_in',
      tableNumber: '',
      cashier: details.cashier || 'Counter 1 / Alex',
      customerName: '',
      customerPhone: '',
      paymentMethod: 'Cash',
    });

    setItems([
      {
        id: `item-${Date.now()}`,
        name: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
    setDiscountValue(0);

    setMobileView('editor');
    notify(`Started new bill #${newBillNo}`, 'info');
  };

  const handleResetBillConfirm = () => {
    setItems([]);
    setDiscountValue(0);
    setDetails((prev) => ({
      ...prev,
      customerName: '',
      customerPhone: '',
      tableNumber: '',
    }));
    setShowResetConfirm(false);
    notify('Bill items and customer fields reset', 'info');
  };

  // Dedicated Print handler
  const handlePrint = () => {
    try {
      printReceiptIsolated('printable-bill', `Restaurant Bill - ${details.billNumber}`);
      notify('Print dialog launched', 'info');
    } catch (e) {
      console.warn('Fallback print', e);
      window.print();
    }
  };

  // Dedicated Download Bill PDF handler (Triggered by the top small download icon!)
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await generateBillPDF({
        elementId: 'printable-bill',
        billNumber: details.billNumber,
        templateId,
      });
      notify(`Bill PDF downloaded: Restaurant_Bill_${details.billNumber}.pdf`, 'success');
    } catch (err) {
      console.error('Download error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      notify(`PDF generation error: ${errMsg}. Launching print fallback...`, 'error');
      setTimeout(() => {
        handlePrint();
      }, 400);
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper to render hidden template so PDF generator and print always find it
  const renderHiddenTemplate = () => {
    const props = { restaurant, details, items, gst, style, calculated };
    switch (templateId) {
      case 'compact_thermal_58mm':
        return <CompactThermal {...props} />;
      case 'modern_invoice_a5':
        return <ModernInvoice {...props} />;
      case 'professional_invoice_a4':
        return <ProfessionalInvoice {...props} />;
      case 'elegant_minimal_a4':
        return <ElegantMinimal {...props} />;
      case 'classic_thermal_80mm':
      default:
        return <ClassicThermal {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Primary Top Bar (Contains the TOP SMALL DOWNLOAD ICON BUTTON!) */}
      <AppHeader
        onNewBill={handleNewBill}
        currentBillNumber={details.billNumber}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        onPrint={handlePrint}
        viewMode={isMobileAppCloneMode ? 'mobile' : 'desktop'}
        onToggleViewMode={(mode) => {
          setIsMobileAppCloneMode(mode === 'mobile');
          if (mode === 'mobile') {
            notify('Entire website converted to Mobile App Clone!', 'success');
          } else {
            notify('Switched to Desktop Split View', 'info');
          }
        }}
        onOpenInstallApp={() => {
          setIsMobileAppCloneMode(true);
          setShowInstallModal(true);
          notify('Entire website converted to Mobile App Clone!', 'success');
        }}
      />

      {/* Hidden persistent receipt container: ensures top small icon download works from ANY tab */}
      <div
        className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 select-none z-[-9999]"
        aria-hidden="true"
      >
        <div id="printable-bill-hidden" className="bg-white p-4">
          {renderHiddenTemplate()}
        </div>
      </div>

      {/* MAIN VIEW CONTENT */}
      {isMobileAppCloneMode ? (
        /* ==================== 1. MOBILE APP CLONE VIEW ==================== */
        <main className="flex-1 w-full max-w-7xl mx-auto py-2 sm:py-6">
          <MobileAppClone
            restaurant={restaurant}
            onRestaurantChange={setRestaurant}
            onSaveRestaurantDefault={handleSaveRestaurantDefault}
            details={details}
            onDetailsChange={setDetails}
            onRegenerateBillNumber={handleRegenerateBillNumber}
            useRandomSuffix={useRandomSuffix}
            onToggleRandomSuffix={handleToggleRandomSuffix}
            items={items}
            onItemsChange={setItems}
            gst={gst}
            onGstChange={setGst}
            discountType={discountType}
            discountValue={discountValue}
            onDiscountTypeChange={setDiscountType}
            onDiscountValueChange={setDiscountValue}
            style={style}
            onStyleChange={setStyle}
            templateId={templateId}
            onTemplateChange={setTemplateId}
            calculated={calculated}
            onNewBill={handleNewBill}
            onResetBill={() => setShowResetConfirm(true)}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            onPrint={handlePrint}
            onNotify={notify}
            isFrameMode={true}
            onOpenInstallApp={() => setShowInstallModal(true)}
            onExitMobile={() => setIsMobileAppCloneMode(false)}
          />
        </main>
      ) : (
        /* ==================== 2. DESKTOP SPLIT POS VIEW ==================== */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Quick Actions Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-800">Draft Status:</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                  <Check className="w-3 h-3 text-neutral-900" />
                  <span>Auto-saved to device</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    saveDraft({
                      billDetails: details,
                      items,
                      gst,
                      style,
                      templateId,
                      discountType,
                      discountValue,
                      useRandomSuffix,
                    });
                    notify('Draft saved to device storage', 'success');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMobileAppCloneMode(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Switch to Mobile App</span>
                </button>
              </div>
            </div>

            {/* Two-Column Split Layout (Editor 60% / Live Receipt 40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Editor */}
              <div className="lg:col-span-7 space-y-6">
                <RestaurantDetailsForm
                  restaurant={restaurant}
                  onChange={setRestaurant}
                  onSaveDefault={handleSaveRestaurantDefault}
                />

                <BillDetailsForm
                  details={details}
                  onChange={setDetails}
                  onRegenerateBillNumber={handleRegenerateBillNumber}
                  useRandomSuffix={useRandomSuffix}
                  onToggleRandomSuffix={handleToggleRandomSuffix}
                />

                <ItemTable items={items} onChange={setItems} />

                <GSTSettings gst={gst} onChange={setGst} />

                <BillSummary
                  calculated={calculated}
                  discountType={discountType}
                  discountValue={discountValue}
                  onDiscountTypeChange={setDiscountType}
                  onDiscountValueChange={setDiscountValue}
                />

                <BillStyleSelector style={style} onChange={setStyle} />

                <TemplateSelector
                  selectedTemplate={templateId}
                  onSelectTemplate={setTemplateId}
                />
              </div>

              {/* Right Column: Live Bill Preview */}
              <div className="lg:col-span-5 lg:sticky lg:top-20">
                <ReceiptPreview
                  restaurant={restaurant}
                  details={details}
                  items={items}
                  gst={gst}
                  style={style}
                  templateId={templateId}
                  calculated={calculated}
                  onNewBill={handleNewBill}
                  onNotify={notify}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Reset Bill Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-neutral-900">Reset Current Bill?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              This will remove all items and clear customer information. Your restaurant settings
              will remain unchanged.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetBillConfirm}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA App Install Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => notify('App installed successfully!', 'success')}
        onEnterMobileClone={() => {
          setIsMobileAppCloneMode(true);
          notify('Switched to Mobile App Clone mode', 'success');
        }}
      />
    </div>
  );
}
