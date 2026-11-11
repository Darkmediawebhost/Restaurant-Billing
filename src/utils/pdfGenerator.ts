import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { TemplateId } from '../types/billing';

const CSS_PX_PER_INCH = 96;

function cssPxToMm(px: number): number {
  return (px * 25.4) / CSS_PX_PER_INCH;
}

interface GeneratePDFOptions {
  elementId: string;
  billNumber: string;
  templateId: TemplateId;
}

/**
 * Downloads a Blob as a file using an anchor element
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

function billSizeMm(element: HTMLElement): { widthMm: number; heightMm: number } {
  const widthPx = element.offsetWidth || element.scrollWidth;
  const heightPx = element.offsetHeight || element.scrollHeight;
  if (!widthPx || !heightPx) {
    throw new Error('The bill has no size yet. Open Live Bill Preview and try again.');
  }
  return {
    widthMm: Math.max(1, cssPxToMm(widthPx)),
    heightMm: Math.max(1, cssPxToMm(heightPx)),
  };
}

/**
 * Rasterizes the natural-size bill. The preview may be zoomed; this node is not.
 */
async function captureBill(element: HTMLElement): Promise<HTMLCanvasElement> {
  const width = element.offsetWidth || element.scrollWidth;
  const height = element.offsetHeight || element.scrollHeight;
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    imageSmoothing: true,
    imageSmoothingQuality: 'high',
  });
}

/**
 * Generates and downloads a PDF that matches the live bill, one page, same proportions.
 */
export async function generateBillPDF({
  elementId,
  billNumber,
}: GeneratePDFOptions): Promise<void> {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    throw new Error('Receipt content element not found in DOM');
  }

  const { widthMm, heightMm } = billSizeMm(sourceElement);
  const canvas = await captureBill(sourceElement);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const safeBillNumber = billNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Restaurant_Bill_${safeBillNumber}.pdf`;
  const orientation = heightMm >= widthMm ? 'portrait' : 'landscape';

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [widthMm, heightMm],
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'SLOW');
  downloadBlob(pdf.output('blob'), filename);
}

function collectDocumentStyles(): string {
  const tags = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map(
    (el) => el.outerHTML
  );
  const adopted = Array.from(document.adoptedStyleSheets || [])
    .map((sheet) => {
      try {
        return `<style>${Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n')}</style>`;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
  return [...tags, ...adopted].join('\n');
}

/**
 * Prints the same full-size bill shown in the live preview, without the app UI.
 */
export function printReceiptIsolated(elementId: string, title = 'Restaurant Bill'): void {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    window.print();
    return;
  }

  const { widthMm, heightMm } = billSizeMm(sourceElement);
  const safeTitle = title.replace(/[<>&]/g, '');
  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', safeTitle);
  iframe.style.cssText = `position:fixed;left:0;top:0;width:${sourceElement.offsetWidth}px;height:${sourceElement.offsetHeight}px;border:0;background:#fff;z-index:2147483646;`;
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    window.print();
    return;
  }

  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${safeTitle}</title>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    ${collectDocumentStyles()}
    <style>
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
      html body #printable-bill,
      html body #printable-bill * { visibility: visible !important; }
      html body #printable-bill {
        position: static !important;
        left: auto !important;
        top: auto !important;
        transform: none !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
      @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
    </style>
  </head>
  <body>${sourceElement.outerHTML}</body>
</html>`);
  doc.close();

  const printWhenReady = () => {
    const fonts = doc.fonts?.ready ?? Promise.resolve();
    fonts.then(() => {
      win.focus();
      win.print();
    });
  };

  if (doc.readyState === 'complete') printWhenReady();
  else iframe.addEventListener('load', printWhenReady, { once: true });

  win.addEventListener('afterprint', cleanup, { once: true });
  window.setTimeout(cleanup, 60000);
}
