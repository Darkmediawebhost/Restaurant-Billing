import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  TemplateId,
  DiscountType,
  FinalizedBill,
} from '../types/billing';

const RESTAURANT_KEY = 'restobill_restaurant_info';
const BILL_COUNTER_KEY = 'restobill_bill_counter';
const BILL_HISTORY_KEY = 'restobill_finalized_history';
const BILL_DRAFT_KEY = 'restobill_active_draft';
const BILL_STYLE_KEY = 'restobill_bill_style';
const BILL_TEMPLATE_KEY = 'restobill_active_template';

export const DEFAULT_RESTAURANT: RestaurantInfo = {
  name: 'The Golden Fork Bistro',
  logoUrl: '',
  address: '142 Market Street, Indiranagar\nBangalore, Karnataka - 560038',
  phone: '+91 98765 43210',
  email: 'contact@goldenfork.in',
  gstin: '29ABCDE1234F1Z5',
  showGstin: true,
  fssai: '11223344556677',
  showFssai: true,
  footerMessage: 'Thank you for dining with us! Please visit again.',
};

export const DEFAULT_BILL_STYLE: BillStyle = {
  styleVariant: 'classic',
  fontSize: 'medium',
  headerAlignment: 'center',
  showLogo: true,
  showGstin: true,
  showFssai: true,
  dividerStyle: 'dashed',
  showCashier: true,
  showBillTime: true,
  footerMessage: 'Thank you for dining with us! Please visit again.',
};

export const DEFAULT_GST_CONFIG: GSTConfig = {
  enabled: true,
  rate: 5, // 5% standard restaurant GST
  taxType: 'intrastate',
  taxTreatment: 'exclusive',
};

export const DEFAULT_ITEMS: BillItem[] = [
  {
    id: 'item-1',
    name: 'Hyderabadi Chicken Biryani',
    quantity: 2,
    unitPrice: 220,
    amount: 440,
  },
  {
    id: 'item-2',
    name: 'Garlic Butter Naan',
    quantity: 3,
    unitPrice: 45,
    amount: 135,
  },
  {
    id: 'item-3',
    name: 'Fresh Lime Soda',
    quantity: 2,
    unitPrice: 50,
    amount: 100,
  },
];

export interface StoredDraft {
  billDetails: BillDetails;
  items: BillItem[];
  gst: GSTConfig;
  style: BillStyle;
  templateId: TemplateId;
  discountType: DiscountType;
  discountValue: number;
  useRandomSuffix: boolean;
}

export function getStoredRestaurantInfo(): RestaurantInfo {
  try {
    const data = localStorage.getItem(RESTAURANT_KEY);
    if (data) {
      return { ...DEFAULT_RESTAURANT, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error reading restaurant info', e);
  }
  return DEFAULT_RESTAURANT;
}

export function saveStoredRestaurantInfo(info: RestaurantInfo): void {
  try {
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(info));
  } catch (e) {
    console.error('Error saving restaurant info', e);
  }
}

export function getBillCounter(): number {
  try {
    const data = localStorage.getItem(BILL_COUNTER_KEY);
    if (data) {
      const num = parseInt(data, 10);
      if (!isNaN(num) && num > 0) return num;
    }
  } catch (e) {
    console.error('Error reading bill counter', e);
  }
  return 1;
}

export function incrementBillCounter(): number {
  const current = getBillCounter();
  const next = current + 1;
  try {
    localStorage.setItem(BILL_COUNTER_KEY, next.toString());
  } catch (e) {
    console.error('Error incrementing bill counter', e);
  }
  return next;
}

export function formatBillNumber(counter: number, withSuffix = false): string {
  const padded = String(counter).padStart(6, '0');
  if (withSuffix) {
    // Generate a consistent 3-char alphanumeric suffix
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `BILL-${padded}-${suffix}`;
  }
  return `BILL-${padded}`;
}

export function getBillHistory(): FinalizedBill[] {
  try {
    const data = localStorage.getItem(BILL_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading bill history', e);
  }
  return [];
}

export function saveFinalizedBill(bill: FinalizedBill): void {
  try {
    const history = getBillHistory();
    // Prepend to show latest first
    const updated = [bill, ...history.filter((b) => b.id !== bill.id)];
    localStorage.setItem(BILL_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving finalized bill', e);
  }
}

export function deleteFinalizedBill(id: string): void {
  try {
    const history = getBillHistory();
    const updated = history.filter((b) => b.id !== id);
    localStorage.setItem(BILL_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting finalized bill', e);
  }
}

export function getStoredDraft(): StoredDraft | null {
  try {
    const data = localStorage.getItem(BILL_DRAFT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading draft', e);
  }
  return null;
}

export function saveDraft(draft: StoredDraft): void {
  try {
    localStorage.setItem(BILL_DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error('Error saving draft', e);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(BILL_DRAFT_KEY);
  } catch (e) {
    console.error('Error clearing draft', e);
  }
}
