export type DiningType = 'dine_in' | 'takeaway' | 'delivery';

export type DividerStyle = 'solid' | 'dashed' | 'dotted';

export type HeaderAlignment = 'left' | 'center';

export type FontSizeOption = 'small' | 'medium' | 'large';

export type StyleVariant = 'classic' | 'modern' | 'compact' | 'bold' | 'elegant';

export const TEMPLATE_IDS = [
  'shop_slip_80mm',
  'simple_list_80mm',
  'cash_memo_80mm',
  'short_slip_58mm',
  'classic_thermal_80mm',
  'compact_thermal_58mm',
  'modern_invoice_a5',
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === 'string' && (TEMPLATE_IDS as readonly string[]).includes(value);
}

export type TaxType = 'intrastate' | 'interstate';

export type TaxTreatment = 'exclusive' | 'inclusive';

export type DiscountType = 'percentage' | 'flat';

export type PaymentMethod = 'Cash' | 'UPI / QR' | 'Card' | 'Online' | 'Other';

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface RestaurantInfo {
  name: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email?: string;
  gstin: string;
  showGstin: boolean;
  fssai: string;
  showFssai: boolean;
  footerMessage: string;
}

export interface BillDetails {
  billNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  diningType: DiningType;
  tableNumber: string;
  cashier: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentNote?: string;
}

export interface GSTConfig {
  enabled: boolean;
  rate: number; // e.g. 5, 12, 18, 28
  taxType: TaxType; // intrastate (CGST+SGST) vs interstate (IGST)
  taxTreatment: TaxTreatment; // exclusive or inclusive
}

export type LayoutBlockId = 'logo' | 'header' | 'details' | 'items' | 'totals' | 'footer';

export const DEFAULT_LAYOUT_ORDER: LayoutBlockId[] = [
  'logo',
  'header',
  'details',
  'items',
  'totals',
  'footer',
];

export interface BillStyle {
  styleVariant: StyleVariant;
  fontSize: FontSizeOption;
  headerAlignment: HeaderAlignment;
  showLogo: boolean;
  showGstin: boolean;
  showFssai: boolean;
  dividerStyle: DividerStyle;
  showCashier: boolean;
  showBillTime: boolean;
  footerMessage?: string;
  layoutOrder?: LayoutBlockId[];
}

export interface BillCalculations {
  totalQuantity: number;
  grossAmount: number; // raw sum of (qty * price)
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  netTaxableAmount: number;
  taxRate: number;
  taxType: TaxType;
  isTaxInclusive: boolean;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  rawGrandTotal: number;
  roundOff: number;
  grandTotal: number;
}

export interface FinalizedBill {
  id: string;
  billNumber: string;
  createdAt: string; // ISO string
  restaurant: RestaurantInfo;
  details: BillDetails;
  items: BillItem[];
  gst: GSTConfig;
  style: BillStyle;
  templateId: TemplateId;
  discountType: DiscountType;
  discountValue: number;
  calculated: BillCalculations;
}
