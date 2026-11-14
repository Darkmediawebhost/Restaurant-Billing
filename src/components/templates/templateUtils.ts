import type { CSSProperties } from 'react';
import { BillStyle, DividerStyle, FontSizeOption, RestaurantInfo, StyleVariant } from '../../types/billing';

export function fontPx(size: FontSizeOption, narrow = false): number {
  const base = size === 'small' ? 10 : size === 'large' ? 13 : 11;
  return narrow ? Math.max(9, base - 1) : base;
}

export function ruleCss(divider: DividerStyle, gap = 0): CSSProperties {
  return {
    borderTop: `1px ${divider} #000000`,
    marginTop: gap,
    height: 0,
  };
}

export function nameLook(variant: StyleVariant, titlePx: number): CSSProperties {
  if (variant === 'bold') {
    return { margin: 0, fontSize: titlePx, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.1 };
  }
  if (variant === 'elegant') {
    return { margin: 0, fontSize: titlePx, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.15 };
  }
  if (variant === 'modern') {
    return { margin: 0, fontSize: titlePx, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 };
  }
  if (variant === 'compact') {
    return { margin: 0, fontSize: Math.max(10, titlePx - 1), fontWeight: 700, lineHeight: 1.05 };
  }
  return { margin: 0, fontSize: titlePx, fontWeight: 700, lineHeight: 1.1 };
}

export function showGstLine(style: BillStyle, restaurant: RestaurantInfo): boolean {
  return Boolean(style.showGstin && restaurant.showGstin !== false && restaurant.gstin);
}

export function showFssaiLine(style: BillStyle, restaurant: RestaurantInfo): boolean {
  return Boolean(style.showFssai && restaurant.showFssai !== false && restaurant.fssai);
}

export function getDividerClass(style: DividerStyle): string {
  switch (style) {
    case 'dashed':
      return 'border-b border-black border-dashed';
    case 'dotted':
      return 'border-b border-black border-dotted';
    case 'solid':
    default:
      return 'border-b border-black';
  }
}

export function getFontSizeScale(option: FontSizeOption) {
  switch (option) {
    case 'small':
      return {
        title: 'text-base',
        subtitle: 'text-[11px]',
        body: 'text-[10px]',
        tableHeader: 'text-[10px] font-semibold',
        tableCell: 'text-[10px]',
        total: 'text-sm font-bold',
      };
    case 'large':
      return {
        title: 'text-xl',
        subtitle: 'text-xs',
        body: 'text-xs',
        tableHeader: 'text-xs font-semibold',
        tableCell: 'text-xs',
        total: 'text-lg font-bold',
      };
    case 'medium':
    default:
      return {
        title: 'text-lg',
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
