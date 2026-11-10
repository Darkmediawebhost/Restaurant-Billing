import React, { useState } from 'react';
import { X, Smartphone, Download, Share2, Check, ArrowRight, QrCode } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess: () => void;
  onEnterMobileClone: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
  onEnterMobileClone,
}) => {
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000';

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onInstallSuccess();
        onClose();
      }
      setInstalling(false);
    } else {
      // If native prompt is not available, we offer the mobile app clone or guide
      onEnterMobileClone();
      onClose();
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
        {/* Header Banner */}
        <div className="bg-neutral-950 text-white p-5 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">RestoBill Mobile App</h3>
                <p className="text-xs text-neutral-400">Install or use mobile app clone</p>
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Primary Quick Convert / Install Actions */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onEnterMobileClone();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl transition-all shadow-sm group font-semibold text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Convert to Mobile App Clone</div>
                  <div className="text-[11px] text-neutral-300 font-normal">Use mobile app right on this screen</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {deferredPrompt && (
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={installing}
                className="w-full flex items-center justify-between p-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl transition-all border border-neutral-300 font-semibold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Download / Install to Device</div>
                    <div className="text-[11px] text-neutral-500 font-normal">Add directly to your device home screen</div>
                  </div>
                </div>
                <span className="text-xs bg-neutral-900 text-white px-2 py-0.5 rounded-md font-bold">1-Click</span>
              </button>
            )}
          </div>

          {/* Mobile Install Guide */}
          <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50 space-y-3">
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <span>📲 How to install on your phone:</span>
            </div>

            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[10px]">
                  Android
                </span>
                <span>Open in Chrome &rarr; tap the top 3 dots (⋮) &rarr; tap <b>"Install app"</b> or <b>"Add to Home screen"</b></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[10px]">
                  iPhone
                </span>
                <span>Open in Safari &rarr; tap the Share button (⎋) &rarr; tap <b>"Add to Home Screen"</b></span>
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
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
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
