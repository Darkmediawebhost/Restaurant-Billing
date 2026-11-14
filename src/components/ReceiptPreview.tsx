import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Download,
  CheckCircle,
  FileDown,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  TemplateId,
  BillCalculations,
} from '../types/billing';
import { ClassicThermal } from './templates/ClassicThermal';
import { CompactThermal } from './templates/CompactThermal';
import { ModernInvoice } from './templates/ModernInvoice';
import { ShopSlip } from './templates/ShopSlip';
import { ExactSlip } from './templates/ExactSlip';
import { ClassicRestaurantReceipt } from './templates/ClassicRestaurantReceipt';
import { SimpleList } from './templates/SimpleList';
import { CashMemo } from './templates/CashMemo';
import { ShortSlip } from './templates/ShortSlip';
import { generateBillPDF, printReceiptIsolated } from '../utils/pdfGenerator';

interface ReceiptPreviewProps {
  restaurant: RestaurantInfo;
  details: BillDetails;
  items: BillItem[];
  gst: GSTConfig;
  style: BillStyle;
  templateId: TemplateId;
  calculated: BillCalculations;
  onNewBill?: () => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  templateId,
  calculated,
  onNewBill,
  onNotify,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [billHeight, setBillHeight] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    const bill = billRef.current;
    if (!frame || !bill) return;

    const measure = () => {
      const available = Math.max(0, frame.clientWidth - 8);
      const width = bill.offsetWidth;
      const height = bill.offsetHeight;
      const narrow = frame.clientWidth < 820;
      const scale = !narrow || !width ? 1 : Math.min(1, available / width);
      setFitScale(scale);
      setBillHeight(height);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(bill);
    return () => observer.disconnect();
  }, [
    templateId,
    style.layoutOrder,
    style.fontSize,
    style.headerAlignment,
    style.dividerStyle,
    restaurant.logoUrl,
    restaurant.footerMessage,
    restaurant.name,
    items,
    details.billNumber,
    calculated.grandTotal,
  ]);

  const visualScale = (zoomLevel / 100) * fitScale;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrint = () => {
    try {
      printReceiptIsolated('printable-bill', `Restaurant Bill - ${details.billNumber}`);
      onNotify('Print dialog launched', 'info');
    } catch (e) {
      console.warn('Isolated print fallback', e);
      window.print();
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateBillPDF({
        elementId: 'printable-bill',
        billNumber: details.billNumber,
        templateId,
      });
      onNotify(`Bill PDF downloaded: Restaurant_Bill_${details.billNumber}.pdf`, 'success');
    } catch (err) {
      console.error('PDF generation error', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      onNotify(`PDF generation error: ${errMsg}. Launching print fallback...`, 'error');
      // Automatic fallback: invoke print so the user can save as PDF directly!
      setTimeout(() => {
        handlePrint();
      }, 500);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderTemplate = () => {
    const props = { restaurant, details, items, gst, style, calculated };
    switch (templateId) {
      case 'compact_thermal_58mm':
        return <CompactThermal {...props} />;
      case 'classic_restaurant_80mm':
        return <ClassicRestaurantReceipt {...props} />;
      case 'classic_restaurant_58mm':
        return <ClassicRestaurantReceipt {...props} narrow />;
      case 'exact_slip_80mm':
        return <ExactSlip {...props} />;
      case 'shop_slip_80mm':
        return <ShopSlip {...props} />;
      case 'simple_list_80mm':
        return <SimpleList {...props} />;
      case 'cash_memo_80mm':
        return <CashMemo {...props} />;
      case 'short_slip_58mm':
        return <ShortSlip {...props} />;
      case 'modern_invoice_a5':
        return <ModernInvoice {...props} />;
      case 'classic_thermal_80mm':
      default:
        return <ClassicThermal {...props} />;
    }
  };

  const isThermal = templateId !== 'modern_invoice_a5';

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-xs flex flex-col lg:max-h-[calc(100vh-6rem)] lg:overflow-hidden">
      {/* Live Preview Controls Header */}
      <div className="p-3 sm:px-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
          <span className="text-xs font-semibold text-neutral-900">Live Bill Preview</span>
          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            ({details.billNumber})
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom out"
            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-neutral-700 px-1.5 tabular-nums min-w-[36px] text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom in"
            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset zoom"
            className="p-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors ml-0.5"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        ref={frameRef}
        className="bg-neutral-200/50 p-2 sm:p-6 overflow-auto flex items-start justify-center lg:flex-1 lg:min-h-[320px]"
      >
        <div
          style={{
            height: billHeight ? billHeight * visualScale : undefined,
          }}
          className="relative w-full"
        >
        <div
          ref={billRef}
          style={{
            transform: `translateX(-50%) scale(${visualScale})`,
            transformOrigin: 'top center',
          }}
          className="absolute left-1/2 top-0"
        >
          <div
            className={`bg-white text-neutral-900 shadow-md transition-all ${
              isThermal ? 'border-t-4 border-neutral-900' : 'rounded-sm border border-neutral-300'
            }`}
          >
            {renderTemplate()}
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Bill</span>
          </button>

          <button
            type="button"
            disabled={isGeneratingPDF}
            onClick={handleGeneratePDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-300 shadow-2xs whitespace-nowrap disabled:opacity-60"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>

        {onNewBill && (
          <button
            type="button"
            onClick={onNewBill}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all border border-neutral-200 whitespace-nowrap active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Next Bill</span>
          </button>
        )}
      </div>
      {createPortal(
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: -1,
            width: 'max-content',
            pointerEvents: 'none',
            background: '#ffffff',
          }}
        >
          <div id="printable-bill" style={{ width: 'max-content', background: '#ffffff' }}>
            {renderTemplate()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
