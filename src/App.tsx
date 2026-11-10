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
import { downloadDesktopShortcut, isAppLaunch, isInstalledDisplay, openAppWindow } from './utils/appLaunch';
import { RotateCcw, Save, Eye, FileText, Check, Smartphone } from 'lucide-react';

export default function App() {
  // Mobile specific view: 'editor' vs 'preview' (standard responsive)
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Dedicated mobile app. Opens full-screen when launched from the installed app or ?app=1.
  const [isMobileAppCloneMode, setIsMobileAppCloneMode] = useState<boolean>(() => isAppLaunch());
  const [fullApp, setFullApp] = useState<boolean>(() => isAppLaunch());

  // PWA install prompt & modal
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [appInstalled, setAppInstalled] = useState<boolean>(() => isInstalledDisplay());

  // Confirmation modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setAppInstalled(true);
      setDeferredPrompt(null);
      setFullApp(true);
      setIsMobileAppCloneMode(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Keyboard shortcuts: Ctrl+P to Print, Ctrl+S to save draft, Alt+M to toggle Mobile App Clone
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
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
      } else if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMobileAppCloneMode((prev) => !prev);
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

  const handleDownloadApp = async () => {
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    const alreadyApp = isAppLaunch();
    let opened: Window | null = window;

    if (alreadyApp) {
      setShowInstallModal(true);
    } else if (!narrow) {
      opened = openAppWindow();
    }
    if (!opened || narrow || alreadyApp) {
      setFullApp(true);
      setIsMobileAppCloneMode(true);
    }

    const promptEvent = deferredPrompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        setDeferredPrompt(null);
        if (choice.outcome === 'accepted') {
          setAppInstalled(true);
          setFullApp(true);
          notify('RestoBill is installed and open. Launch it from your home screen next time — it will not open as a browser tab.', 'success');
          return;
        }
      } catch {
        setDeferredPrompt(null);
      }
    }

    if (!alreadyApp && !narrow && !appInstalled && !isInstalledDisplay()) {
      downloadDesktopShortcut();
    }

    if (!opened) {
      notify('Pop-up was blocked, so the app is open on this screen. Allow pop-ups to open it in its own window.', 'info');
      return;
    }

    if (opened !== window) opened.focus();

    notify(
      narrow || alreadyApp
        ? 'RestoBill app is open on this screen. To keep it off the browser, use Install app or Add to Home Screen.'
        : 'RestoBill is open in its own window. A RestoBill.url shortcut was also saved in Downloads.',
      'success'
    );
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* PWA / Download Mobile App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => notify('RestoBill is installed and open.', 'success')}
        onDownloadApp={handleDownloadApp}
        onEnterMobileClone={() => {
          setFullApp(false);
          setIsMobileAppCloneMode(true);
          notify('Previewing the app on this page', 'info');
        }}
      />

      {isMobileAppCloneMode ? (
        /* ================= MOBILE APP CLONE MODE ================= */
        <MobileAppClone
          restaurant={restaurant}
          setRestaurant={setRestaurant}
          onSaveRestaurantDefault={handleSaveRestaurantDefault}
          details={details}
          setDetails={setDetails}
          onRegenerateBillNumber={handleRegenerateBillNumber}
          useRandomSuffix={useRandomSuffix}
          onToggleRandomSuffix={handleToggleRandomSuffix}
          items={items}
          setItems={setItems}
          gst={gst}
          setGst={setGst}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          style={style}
          setStyle={setStyle}
          templateId={templateId}
          setTemplateId={setTemplateId}
          calculated={calculated}
          onNewBill={handleNewBill}
          onResetBill={() => setShowResetConfirm(true)}
          onSaveDraft={() => {
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
          onExitMobile={() => {
            if (window.opener && isAppLaunch()) {
              window.close();
              return;
            }
            setFullApp(false);
            setIsMobileAppCloneMode(false);
          }}
          onDownloadApp={handleDownloadApp}
          onNotify={notify}
          launched={fullApp || isAppLaunch()}
          appInstalled={appInstalled}
        />
      ) : (
        /* ================= STANDARD DESKTOP / RESPONSIVE VIEW ================= */
        <>
          {/* Primary Top Bar */}
          <AppHeader
            onNewBill={handleNewBill}
            currentBillNumber={details.billNumber}
            onDownloadApp={handleDownloadApp}
          />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Mobile View Switcher (Editor vs Preview tabs) */}
          <div className="lg:hidden flex items-center p-1 bg-neutral-200/80 rounded-lg border border-neutral-300">
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                mobileView === 'editor'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bill Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                mobileView === 'preview'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview (₹{calculated.grandTotal})</span>
            </button>
          </div>

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
                onClick={handleDownloadApp}
                title="Download and open the RestoBill app"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open App</span>
              </button>

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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* Two-Column Layout (Desktop: 60% Editor / 40% Live Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Editor (60% ~ 7 cols) */}
            <div
              className={`lg:col-span-7 space-y-6 ${
                mobileView === 'preview' ? 'hidden lg:block' : 'block'
              }`}
            >
              {/* 1. Restaurant Information */}
              <RestaurantDetailsForm
                restaurant={restaurant}
                onChange={setRestaurant}
                onSaveDefault={handleSaveRestaurantDefault}
              />

              {/* 2. Bill Metadata & Customer Info */}
              <BillDetailsForm
                details={details}
                onChange={setDetails}
                onRegenerateBillNumber={handleRegenerateBillNumber}
                useRandomSuffix={useRandomSuffix}
                onToggleRandomSuffix={handleToggleRandomSuffix}
              />

              {/* 3. Food Items Management */}
              <ItemTable items={items} onChange={setItems} />

              {/* 4. GST Configuration */}
              <GSTSettings gst={gst} onChange={setGst} />

              {/* 5. Bill Summary & Discount */}
              <BillSummary
                calculated={calculated}
                discountType={discountType}
                discountValue={discountValue}
                onDiscountTypeChange={setDiscountType}
                onDiscountValueChange={setDiscountValue}
              />

              {/* 6. Bill Style Customization */}
              <BillStyleSelector style={style} onChange={setStyle} />

              {/* 7. Template Selection */}
              <TemplateSelector
                selectedTemplate={templateId}
                onSelectTemplate={setTemplateId}
              />
            </div>

            {/* Right Column: Live Bill Preview (40% ~ 5 cols, Sticky on Desktop) */}
            <div
              className={`lg:col-span-5 lg:sticky lg:top-20 ${
                mobileView === 'editor' ? 'hidden lg:block' : 'block'
              }`}
            >
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
                className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetBillConfirm}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Total Due</div>
          <div className="font-mono font-bold text-base text-neutral-950">
            ₹{calculated.grandTotal}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mobileView === 'editor' ? (
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview & Print</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Back to Edit</span>
            </button>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
