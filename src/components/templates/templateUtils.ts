import { DividerStyle, FontSizeOption, StyleVariant } from '../../types/billing';

export function getDividerClass(style: DividerStyle): string {
  switch (style) {
    case 'dashed':
      return 'border-b border-neutral-800 border-dashed';
    case 'dotted':
      return 'border-b border-neutral-800 border-dotted';
    case 'solid':
    default:
      return 'border-b border-neutral-800';
  }
}

export function getFontSizeScale(option: FontSizeOption) {
  switch (option) {
    case 'small':
      return {
        title: 'text-base font-bold',
        subtitle: 'text-[11px]',
        body: 'text-[10px]',
        tableHeader: 'text-[10px] font-semibold',
        tableCell: 'text-[10px]',
        total: 'text-sm font-bold',
      };
    case 'large':
      return {
        title: 'text-xl font-bold',
        subtitle: 'text-xs',
        body: 'text-xs',
        tableHeader: 'text-xs font-semibold',
        tableCell: 'text-xs',
        total: 'text-lg font-bold',
      };
    case 'medium':
    default:
      return {
        title: 'text-lg font-bold',
        subtitle: 'text-[11px]',
        body: 'text-[11px]',
        tableHeader: 'text-[11px] font-semibold',
        tableCell: 'text-[11px]',
        total: 'text-base font-bold',
      };
  }
}

export function getVariantStyles(variant: StyleVariant) {
  switch (variant) {
    case 'bold':
      return {
        headerWeight: 'font-extrabold uppercase tracking-wider',
        dividerWeight: 'border-b-2 border-neutral-950',
        tableHeadBg: 'bg-neutral-100 text-neutral-950 font-bold',
        accentBg: 'bg-neutral-950 text-white',
      };
    case 'modern':
      return {
        headerWeight: 'font-semibold tracking-tight',
        dividerWeight: 'border-b border-neutral-300',
        tableHeadBg: 'bg-neutral-50 text-neutral-700',
        accentBg: 'bg-neutral-900 text-white',
      };
    case 'compact':
      return {
        headerWeight: 'font-bold uppercase tracking-tight',
        dividerWeight: 'border-b border-neutral-400',
        tableHeadBg: 'bg-transparent text-neutral-900 font-semibold',
        accentBg: 'bg-neutral-900 text-white',
      };
    case 'elegant':
      return {
        headerWeight: 'font-medium uppercase tracking-[0.2em]',
        dividerWeight: 'border-b border-neutral-200',
        tableHeadBg: 'bg-transparent text-neutral-500 uppercase tracking-widest text-[9px]',
        accentBg: 'bg-neutral-900 text-white',
      };
    case 'classic':
    default:
      return {
        headerWeight: 'font-bold uppercase tracking-wider',
        dividerWeight: 'border-b border-neutral-900',
        tableHeadBg: 'bg-transparent text-neutral-900 font-bold',
        accentBg: 'bg-neutral-950 text-white',
      };
  }
}
