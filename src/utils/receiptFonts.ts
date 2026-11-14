import type { CSSProperties } from 'react';
import type { ReceiptFontId } from '../types/billing';

export interface ReceiptFontOption {
  id: ReceiptFontId;
  label: string;
  group: 'Default' | 'Sans' | 'Mono' | 'Serif';
  stack: string;
}

export const RECEIPT_FONTS: ReceiptFontOption[] = [
  { id: 'default', label: 'Template default', group: 'Default', stack: '' },
  { id: 'roboto', label: 'Roboto', group: 'Sans', stack: "'Roboto', sans-serif" },
  { id: 'noto_sans', label: 'Noto Sans', group: 'Sans', stack: "'Noto Sans', sans-serif" },
  { id: 'open_sans', label: 'Open Sans', group: 'Sans', stack: "'Open Sans', sans-serif" },
  { id: 'inter', label: 'Inter', group: 'Sans', stack: "'Inter', sans-serif" },
  { id: 'source_sans', label: 'Source Sans 3', group: 'Sans', stack: "'Source Sans 3', sans-serif" },
  { id: 'ibm_plex_sans', label: 'IBM Plex Sans', group: 'Sans', stack: "'IBM Plex Sans', sans-serif" },
  { id: 'poppins', label: 'Poppins', group: 'Sans', stack: "'Poppins', sans-serif" },
  { id: 'work_sans', label: 'Work Sans', group: 'Sans', stack: "'Work Sans', sans-serif" },
  { id: 'roboto_mono', label: 'Roboto Mono', group: 'Mono', stack: "'Roboto Mono', monospace" },
  { id: 'ibm_plex_mono', label: 'IBM Plex Mono', group: 'Mono', stack: "'IBM Plex Mono', monospace" },
  { id: 'courier_prime', label: 'Courier Prime', group: 'Mono', stack: "'Courier Prime', monospace" },
  { id: 'jetbrains_mono', label: 'JetBrains Mono', group: 'Mono', stack: "'JetBrains Mono', monospace" },
  { id: 'merriweather', label: 'Merriweather', group: 'Serif', stack: "'Merriweather', serif" },
  { id: 'libre_baskerville', label: 'Libre Baskerville', group: 'Serif', stack: "'Libre Baskerville', serif" },
  { id: 'lora', label: 'Lora', group: 'Serif', stack: "'Lora', serif" },
];

export function receiptFontById(id: string | undefined): ReceiptFontOption {
  return RECEIPT_FONTS.find((font) => font.id === id) ?? RECEIPT_FONTS[0];
}

export function billFontProps(id: string | undefined): { className: string; style: CSSProperties } {
  const font = receiptFontById(id);
  if (!font.stack) return { className: '', style: {} };
  return {
    className: 'bill-font',
    style: {
      fontFamily: font.stack,
      ['--bill-font' as string]: font.stack,
    } as CSSProperties,
  };
}
