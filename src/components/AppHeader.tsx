import React from 'react';
import { Receipt, Plus, FileText, Download, Smartphone } from 'lucide-react';

interface AppHeaderProps {
  onNewBill: () => void;
  currentBillNumber: string;
  onDownloadApp: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onNewBill,
  currentBillNumber,
  onDownloadApp,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-950 whitespace-nowrap">
                RestoBill
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation link */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-neutral-100 text-neutral-900 border border-neutral-200 whitespace-nowrap">
              <FileText className="w-3.5 h-3.5 text-neutral-700" />
              <span>Bill Generator</span>
              <span className="text-[11px] font-mono font-medium text-neutral-500">
                · {currentBillNumber}
              </span>
            </div>
          </nav>

          {/* Zone 3: Actions - Download App / Mobile App Clone + New Bill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Top Download / Mobile App Clone Icon */}
            <button
              type="button"
              onClick={onDownloadApp}
              title="Download and open the RestoBill app"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-700 rounded-lg active:scale-95 transition-all whitespace-nowrap shadow-2xs group cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white group-hover:translate-y-0.5 transition-all" />
              <Smartphone className="w-3.5 h-3.5 text-emerald-100" />
              <span className="font-bold">Download App</span>
            </button>

            <button
              onClick={onNewBill}
              title="Create a new fresh bill"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-neutral-950 rounded-lg hover:bg-neutral-800 active:scale-98 transition-all whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Bill</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
