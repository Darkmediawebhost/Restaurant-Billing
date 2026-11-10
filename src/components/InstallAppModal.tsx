import React, { useState } from 'react';
import { X, Smartphone, Download, Share2, Check, ArrowRight } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess: () => void;
  onDownloadApp: () => void;
  onEnterMobileClone: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
  onDownloadApp,
  onEnterMobileClone,
}) => {
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleNativeInstall = async () => {
    if (!deferredPrompt) {
      onDownloadApp();
      return;
    }
    setInstalling(true);
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onInstallSuccess();
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-950 text-white p-5 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-300 ring-1 ring-emerald-400/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">RestoBill app</h3>
                <p className="text-xs text-neutral-400">Opens as an app, not as this website</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onDownloadApp();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl transition-all shadow-sm group font-semibold text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Download and open app</div>
                  <div className="text-[11px] text-emerald-50 font-normal">Opens RestoBill in its own window</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-100 group-hover:translate-x-1 transition-transform" />
            </button>

            {deferredPrompt && (
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={installing}
                className="w-full flex items-center justify-between p-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl transition-all font-semibold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{installing ? 'Installing…' : 'Install on this device'}</div>
                    <div className="text-[11px] text-neutral-300 font-normal">Adds RestoBill to your home screen</div>
                  </div>
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onEnterMobileClone();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl transition-all border border-neutral-300 font-semibold text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Preview on this page</div>
                  <div className="text-[11px] text-neutral-500 font-normal">Phone frame inside the browser</div>
                </div>
              </div>
            </button>
          </div>

          <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50 space-y-3">
            <div className="text-xs font-bold text-neutral-900">Keep it off the browser next time</div>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[10px]">
                  Android
                </span>
                <span>Chrome menu (⋮) → <b>Install app</b> or <b>Add to Home screen</b></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[10px]">
                  iPhone
                </span>
                <span>Safari Share button → <b>Add to Home Screen</b></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[10px]">
                  Desktop
                </span>
                <span>Use the RestoBill window, or open <b>RestoBill.url</b> from Downloads</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
              <span className="text-[11px] text-neutral-500 truncate max-w-[200px]">{currentUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors text-neutral-800 shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
