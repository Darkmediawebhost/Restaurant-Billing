import React from 'react';
import {
  Receipt,
  Plus,
  FileText,
  Download,
  Printer,
  Smartphone,
  Monitor,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface AppHeaderProps {
  onNewBill: () => void;
  currentBillNumber: string;
  onDownload: () => void;
  isDownloading?: boolean;
  onPrint?: () => void;
  viewMode?: 'mobile' | 'desktop';
  onToggleViewMode?: (mode: 'mobile' | 'desktop') => void;
  onOpenInstallApp?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onNewBill,
  currentBillNumber,
  onDownload,
  isDownloading = false,
  onPrint,
  viewMode = 'mobile',
  onToggleViewMode,
  onOpenInstallApp,
}) => {
  const handleDownloadAppClick = () => {
    // 1. Immediately convert entire website into mobile app clone
    if (onToggleViewMode) {
      onToggleViewMode('mobile');
    }
    // 2. Open the mobile app download / installation modal
    if (onOpenInstallApp) {
      onOpenInstallApp();
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Zone 1: Brand & Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold shadow-xs">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-950 whitespace-nowrap">
                  RestoBill
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden xs:inline-block">
                  POS
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium hidden sm:block">
                Mobile Restaurant Billing
              </p>
            </div>
          </div>

          {/* Zone 2: Current Bill badge */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200">
              <FileText className="w-3.5 h-3.5 text-neutral-600 hidden xs:inline" />
              <span className="font-mono font-bold text-neutral-800 text-[11px] sm:text-xs">
                #{currentBillNumber}
              </span>
            </div>

            {/* Desktop View Switcher (Mobile App Simulator vs Desktop POS) */}
            {onToggleViewMode && (
              <div className="hidden md:flex items-center p-0.5 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
                <button
                  type="button"
                  onClick={() => onToggleViewMode('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-white text-neutral-950 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Mobile App Clone View"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mobile App</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleViewMode('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === 'desktop'
                      ? 'bg-white text-neutral-950 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Desktop Dual Screen View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Split View</span>
                </button>
              </div>
            )}
          </div>

          {/* Zone 3: Quick Header Actions including the TOP DOWNLOAD ICON! */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Top Small Download / Mobile App Convert Button (USER REQUEST: "webiste top small icon need dowload that click time enairty webiste lone mobile app convert please") */}
            <button
              type="button"
              onClick={handleDownloadAppClick}
              title="Download App / Convert entire website to Mobile App Clone"
              aria-label="Download and Convert to Mobile App Clone"
              className="group relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-y-0.5" />
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
              <span>Download App</span>
              <span className="hidden xs:inline-block text-[9px] bg-emerald-950/40 text-emerald-100 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Mobile Clone
              </span>
            </button>

            {/* Quick Bill PDF Download */}
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              title="Download current bill receipt as PDF"
              aria-label="Download Bill Receipt PDF"
              className="p-1.5 sm:px-2.5 sm:py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-95 rounded-lg transition-all border border-neutral-200 flex items-center gap-1 cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-neutral-600" />
              )}
              <span className="hidden sm:inline">Bill PDF</span>
            </button>

            {/* Quick Print Icon */}
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                title="Quick Print Bill"
                aria-label="Print Bill"
                className="p-1.5 sm:px-3 sm:py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-95 rounded-lg transition-all border border-neutral-200 hidden sm:flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            )}

            {/* New Bill Button */}
            <button
              type="button"
              onClick={onNewBill}
              title="Create a new fresh bill"
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Bill</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
