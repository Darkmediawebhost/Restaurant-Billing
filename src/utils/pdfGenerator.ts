import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { TemplateId } from '../types/billing';

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

/**
 * Generates and downloads a high-resolution PDF for the specified bill element
 */
export async function generateBillPDF({
  elementId,
  billNumber,
  templateId,
}: GeneratePDFOptions): Promise<void> {
  let sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    sourceElement = document.getElementById('printable-bill-hidden');
  }
  if (!sourceElement) {
    sourceElement = document.getElementById('printable-bill');
  }
  if (!sourceElement) {
    throw new Error('Receipt content element not found in DOM');
  }

  // Clone element into a clean detached container with NO CSS transforms
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.id = `pdf-export-${Date.now()}`;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.zIndex = '-9999';
  clone.style.background = '#ffffff';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';

  document.body.appendChild(clone);

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(clone, {
      scale: 2.0, // High-DPI crisp rasterization
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: clone.scrollWidth || sourceElement.scrollWidth || 800,
    });
  } finally {
    // Always clean up clone from DOM
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }

  const imgData = canvas.toDataURL('image/png', 1.0);
  const safeBillNumber = billNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Restaurant_Bill_${safeBillNumber}.pdf`;

  // Compute PDF dimensions based on template
  if (templateId === 'compact_thermal_58mm') {
    const widthMm = 58;
    const heightMm = Math.max(60, (canvas.height * widthMm) / canvas.width);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [widthMm, heightMm],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');
    const blob = pdf.output('blob');
    downloadBlob(blob, filename);
  } else if (templateId === 'classic_thermal_80mm') {
    const widthMm = 80;
    const heightMm = Math.max(80, (canvas.height * widthMm) / canvas.width);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [widthMm, heightMm],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');
    const blob = pdf.output('blob');
    downloadBlob(blob, filename);
  } else if (templateId === 'modern_invoice_a5') {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });
    const pageWidthMm = 148;
    const pageHeightMm = 210;
    const imgHeightMm = (canvas.height * pageWidthMm) / canvas.width;

    if (imgHeightMm <= pageHeightMm) {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMm, imgHeightMm, undefined, 'FAST');
    } else {
      let heightLeft = imgHeightMm;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pageWidthMm, imgHeightMm, undefined, 'FAST');
      heightLeft -= pageHeightMm;

      while (heightLeft > 0) {
        position = position - pageHeightMm;
        pdf.addPage('a5', 'portrait');
        pdf.addImage(imgData, 'PNG', 0, position, pageWidthMm, imgHeightMm, undefined, 'FAST');
        heightLeft -= pageHeightMm;
      }
    }
    const blob = pdf.output('blob');
    downloadBlob(blob, filename);
  } else {
    // A4 for professional_invoice_a4 and elegant_minimal_a4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const imgHeightMm = (canvas.height * pageWidthMm) / canvas.width;

    if (imgHeightMm <= pageHeightMm) {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMm, imgHeightMm, undefined, 'FAST');
    } else {
      let heightLeft = imgHeightMm;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pageWidthMm, imgHeightMm, undefined, 'FAST');
      heightLeft -= pageHeightMm;

      while (heightLeft > 0) {
        position = position - pageHeightMm;
        pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'PNG', 0, position, pageWidthMm, imgHeightMm, undefined, 'FAST');
        heightLeft -= pageHeightMm;
      }
    }
    const blob = pdf.output('blob');
    downloadBlob(blob, filename);
  }
}

/**
 * Dedicated thermal and invoice print engine that opens a clean isolated print
 * iframe so surrounding UI/buttons never clutter the printed page.
 */
export function printReceiptIsolated(elementId: string, title = 'Restaurant Bill'): void {
  let sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    sourceElement = document.getElementById('printable-bill-hidden');
  }
  if (!sourceElement) {
    sourceElement = document.getElementById('printable-bill');
  }
  if (!sourceElement) {
    window.print();
    return;
  }

  // Create invisible iframe for clean print
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    document.body.removeChild(iframe);
    return;
  }

  // Collect active style links & tags from main document
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        ${headStyles}
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body {
            margin: 0;
            padding: 8px;
            background: #ffffff !important;
            display: flex;
            justify-content: center;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          }
          @page {
            margin: 3mm;
            size: auto;
          }
        </style>
      </head>
      <body>
        <div id="print-wrapper">
          ${sourceElement.outerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 250);
          };
        </script>
      </body>
    </html>
  `);
  doc.close();

  // Remove iframe after print dialogue triggered
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 3000);
}
