import React, { useState, useEffect } from 'react';
import {
  RestaurantInfo,
  BillDetails,
  BillItem,
  GSTConfig,
  BillStyle,
  TemplateId,
  DiscountType,
  PaymentMethod,
  BillCalculations,
} from '../types/billing';
import {
  Receipt,
  UtensilsCrossed,
  Percent,
  Eye,
  Store,
  Download,
  Printer,
  Plus,
  Trash2,
  Minus,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  Check,
  RotateCcw,
  Save,
  Loader2,
  Calendar,
  Clock as ClockIcon,
  User,
  Phone,
  Hash,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  FileText,
  Smartphone,
} from 'lucide-react';
import { formatINR } from '../utils/calculations';
import { RestaurantDetailsForm } from './RestaurantDetailsForm';
import { BillDetailsForm } from './BillDetailsForm';
import { GSTSettings } from './GSTSettings';
import { BillSummary } from './BillSummary';
import { BillStyleSelector } from './BillStyleSelector';
import { TemplateSelector } from './TemplateSelector';
import { ReceiptPreview } from './ReceiptPreview';
import { DiningTypeSelector } from './DiningTypeSelector';

interface MobileAppCloneProps {
  restaurant: RestaurantInfo;
  onRestaurantChange: (r: RestaurantInfo) => void;
  onSaveRestaurantDefault: () => void;
  details: BillDetails;
  onDetailsChange: (d: BillDetails) => void;
  onRegenerateBillNumber: () => void;
  useRandomSuffix: boolean;
  onToggleRandomSuffix: (val: boolean) => void;
  items: BillItem[];
  onItemsChange: (items: BillItem[]) => void;
  gst: GSTConfig;
  onGstChange: (g: GSTConfig) => void;
  discountType: DiscountType;
  discountValue: number;
  onDiscountTypeChange: (dt: DiscountType) => void;
  onDiscountValueChange: (dv: number) => void;
  style: BillStyle;
  onStyleChange: (s: BillStyle) => void;
  templateId: TemplateId;
  onTemplateChange: (t: TemplateId) => void;
  calculated: BillCalculations;
  onNewBill: () => void;
  onResetBill: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  onPrint: () => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
  isFrameMode?: boolean;
  onOpenInstallApp?: () => void;
  onExitMobile?: () => void;
}

// Popular food items for instant 1-tap POS billing
const QUICK_MENU_PRESETS = [
  { name: 'Chicken Biryani', price: 220, emoji: '🍗' },
  { name: 'Paneer Butter Masala', price: 180, emoji: '🧀' },
  { name: 'Butter Naan', price: 40, emoji: '🫓' },
  { name: 'Veg Fried Rice', price: 140, emoji: '🍚' },
  { name: 'Crispy Veg Burger', price: 99, emoji: '🍔' },
  { name: 'Margherita Pizza', price: 199, emoji: '🍕' },
  { name: 'French Fries', price: 80, emoji: '🍟' },
  { name: 'Masala Dosa', price: 85, emoji: '🥞' },
  { name: 'Cold Coffee', price: 60, emoji: '🧋' },
  { name: 'Fresh Lime Soda', price: 50, emoji: '🥤' },
  { name: 'Masala Chai', price: 25, emoji: '☕' },
  { name: 'Gulab Jamun', price: 60, emoji: '🍨' },
];

export const MobileAppClone: React.FC<MobileAppCloneProps> = ({
  restaurant,
  onRestaurantChange,
  onSaveRestaurantDefault,
  details,
  onDetailsChange,
  onRegenerateBillNumber,
  useRandomSuffix,
  onToggleRandomSuffix,
  items,
  onItemsChange,
  gst,
  onGstChange,
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
  style,
  onStyleChange,
  templateId,
  onTemplateChange,
  calculated,
  onNewBill,
  onResetBill,
  onDownload,
  isDownloading,
  onPrint,
  onNotify,
  isFrameMode = false,
  onOpenInstallApp,
  onExitMobile,
}) => {
  // Toggle between realistic phone chassis and expanded full mobile view
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return false;
    return isFrameMode;
  });

  // Mobile app active tab
  const [activeTab, setActiveTab] = useState<'order' | 'items' | 'tax' | 'receipt' | 'store'>('items');

  // Real-time status bar clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('09:41');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const h12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      setCurrentTimeStr(`${h12}:${String(minutes).padStart(2, '0')} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Quick preset tap handler
  const handleAddQuickPreset = (preset: { name: string; price: number }) => {
    const existingIndex = items.findIndex(
      (it) => it.name.trim().toLowerCase() === preset.name.toLowerCase()
    );
    if (existingIndex >= 0) {
      const copy = [...items];
      const cur = copy[existingIndex];
      const newQty = (cur.quantity || 1) + 1;
      copy[existingIndex] = {
        ...cur,
        quantity: newQty,
        amount: newQty * cur.unitPrice,
      };
      onItemsChange(copy);
      onNotify(`Increased ${preset.name} (Qty: ${newQty})`, 'info');
    } else {
      const newItem: BillItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: preset.name,
        quantity: 1,
        unitPrice: preset.price,
        amount: preset.price,
      };
      onItemsChange([...items, newItem]);
      onNotify(`Added ${preset.name} to bill`, 'success');
    }
  };

  // Add custom item
  const handleAddEmptyItem = () => {
    const newItem: BillItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    onItemsChange([...items, newItem]);
  };

  // Modify item quantity
  const handleStepQuantity = (index: number, delta: number) => {
    const copy = [...items];
    const it = copy[index];
    const newQty = Math.max(1, (it.quantity || 1) + delta);
    copy[index] = {
      ...it,
      quantity: newQty,
      amount: newQty * (it.unitPrice || 0),
    };
    onItemsChange(copy);
  };

  const handleUpdateItem = (index: number, updated: BillItem) => {
    const copy = [...items];
    copy[index] = updated;
    onItemsChange(copy);
  };

  const handleRemoveItem = (index: number) => {
    const copy = items.filter((_, i) => i !== index);
    onItemsChange(copy);
  };

  const totalItemCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  // Mobile App content
  const appContent = (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-neutral-900 overflow-hidden font-sans select-none">
      {/* 1. NATIVE STATUS BAR */}
      <div className="bg-neutral-950 text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold tracking-wide shrink-0">
        <span className="font-mono">{currentTimeStr}</span>
        {/* Dynamic Island / Speaker Pill */}
        <div className="w-20 h-4 bg-neutral-900 rounded-full border border-neutral-800 flex items-center justify-center gap-1 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] text-neutral-400 font-mono tracking-tighter">POS</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-300">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      {/* 2. APP HEADER BAR (with top small download icon button!) */}
      <div className="bg-white border-b border-neutral-200 px-3 py-2.5 flex items-center justify-between gap-2 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center shadow-xs">
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="leading-tight">
            <h1 className="text-xs font-bold text-neutral-900 truncate max-w-[130px] sm:max-w-[200px]">
              {restaurant.name || 'RestoBill POS'}
            </h1>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-neutral-500 font-semibold">
                #{details.billNumber}
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] text-emerald-700 font-medium capitalize">
                {details.diningType.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Top small icon download action & quick tools */}
        <div className="flex items-center gap-1.5">
          {/* USER REQUIREMENT: "webiste top small icon need dowload that click time" */}
          {onOpenInstallApp && (
            <button
              type="button"
              onClick={onOpenInstallApp}
              title="Download & Install Mobile App to Device"
              aria-label="Download Mobile App"
              className="group flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-90 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
              <span className="text-[11px] font-bold">App</span>
            </button>
          )}

          {/* Quick PDF Bill Download */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            title="Download Bill (PDF)"
            aria-label="Download Bill PDF"
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 active:scale-90 rounded-lg border border-neutral-200 transition-all cursor-pointer disabled:opacity-60"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-neutral-600" />
            )}
            <span className="text-[11px]">PDF</span>
          </button>

          {/* Quick Print Icon */}
          <button
            type="button"
            onClick={onPrint}
            title="Quick Thermal Print"
            className="p-1.5 text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 active:scale-90 rounded-lg border border-neutral-200 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* New Bill Icon */}
          <button
            type="button"
            onClick={onNewBill}
            title="New Fresh Bill"
            className="p-1.5 text-white bg-neutral-950 hover:bg-neutral-800 active:scale-90 rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN SCROLLABLE APP BODY */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 min-h-0">
        {/* TAB 1: ORDER & CUSTOMER DETAILS */}
        {activeTab === 'order' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Dining Type selector card */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Dining Option
              </label>
              <DiningTypeSelector
                value={details.diningType}
                onChange={(dt) => onDetailsChange({ ...details, diningType: dt })}
              />
            </div>

            {/* Bill Details Inputs */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Invoice & Table Info</span>
                </span>
                <button
                  type="button"
                  onClick={onRegenerateBillNumber}
                  className="text-[10px] text-emerald-700 font-semibold hover:underline"
                >
                  Regenerate #
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                    Bill Number
                  </label>
                  <input
                    type="text"
                    value={details.billNumber}
                    onChange={(e) => onDetailsChange({ ...details, billNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                    Table / Token #
                  </label>
                  <input
                    type="text"
                    value={details.tableNumber || ''}
                    placeholder="e.g. T-04"
                    onChange={(e) => onDetailsChange({ ...details, tableNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={details.date}
                    onChange={(e) => onDetailsChange({ ...details, date: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                    Bill Time
                  </label>
                  <input
                    type="time"
                    value={details.time}
                    onChange={(e) => onDetailsChange({ ...details, time: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                  Cashier / Server
                </label>
                <input
                  type="text"
                  value={details.cashier || ''}
                  placeholder="Alex / Counter 1"
                  onChange={(e) => onDetailsChange({ ...details, cashier: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Customer Information</span>
              </span>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={details.customerName || ''}
                    placeholder="e.g. Rahul Sharma"
                    onChange={(e) => onDetailsChange({ ...details, customerName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-500 font-medium block mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={details.customerPhone || ''}
                    placeholder="+91 98765 43210"
                    onChange={(e) => onDetailsChange({ ...details, customerPhone: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'UPI / QR', label: 'UPI / QR', icon: QrCode },
                  { id: 'Card', label: 'Card', icon: CreditCard },
                ] as const).map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = (details.paymentMethod || 'Cash') === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => onDetailsChange({ ...details, paymentMethod: pm.id as PaymentMethod })}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                        isSelected
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FOOD ITEMS & QUICK POS MENU */}
        {activeTab === 'items' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* 1-Tap Quick Menu Preset Bar */}
            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Tap Quick Food Menu</span>
                </span>
                <span className="text-[10px] text-neutral-400">Tap to add</span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                {QUICK_MENU_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddQuickPreset(preset)}
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 hover:bg-emerald-50 active:scale-95 border border-neutral-200 hover:border-emerald-300 rounded-lg transition-all text-xs cursor-pointer shadow-2xs"
                  >
                    <span>{preset.emoji}</span>
                    <span className="font-medium text-neutral-800 text-[11px] whitespace-nowrap">
                      {preset.name}
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-[11px]">
                      ₹{preset.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Added Items List */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">Current Order Items</h3>
                  <p className="text-[10px] text-neutral-500">
                    {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in bill
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEmptyItem}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 active:scale-95 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="py-8 text-center space-y-2 border border-dashed border-neutral-200 rounded-lg">
                  <UtensilsCrossed className="w-6 h-6 mx-auto text-neutral-300" />
                  <p className="text-xs font-medium text-neutral-600">No items in this bill</p>
                  <p className="text-[10px] text-neutral-400">
                    Tap any item from the quick menu above or click Add Item
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 w-4">
                          {index + 1}.
                        </span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateItem(index, {
                              ...item,
                              name: e.target.value,
                              amount: (item.quantity || 0) * (item.unitPrice || 0),
                            })
                          }
                          placeholder="Item Name (e.g. Masala Dosa)"
                          className="flex-1 px-2 py-1 text-xs font-semibold bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          title="Remove item"
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100">
                        {/* Stepper */}
                        <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleStepQuantity(index, -1)}
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 active:scale-95 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 text-neutral-900 min-w-[28px] text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStepQuantity(index, 1)}
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 active:scale-95 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price & Subtotal */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-neutral-400">₹</span>
                            <input
                              type="number"
                              min={0}
                              value={item.unitPrice || ''}
                              placeholder="Price"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                handleUpdateItem(index, {
                                  ...item,
                                  unitPrice: val,
                                  amount: (item.quantity || 0) * val,
                                });
                              }}
                              className="w-16 px-1.5 py-1 text-xs font-mono text-right bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                          </div>
                          <span className="font-mono font-bold text-xs text-neutral-900 w-16 text-right tabular-nums">
                            {formatINR(item.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TAX & SUMMARY */}
        {activeTab === 'tax' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* GST Settings */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
              <GSTSettings gst={gst} onChange={onGstChange} />
            </div>

            {/* Discount & Breakdown Summary */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
              <BillSummary
                calculated={calculated}
                discountType={discountType}
                discountValue={discountValue}
                onDiscountTypeChange={onDiscountTypeChange}
                onDiscountValueChange={onDiscountValueChange}
              />
            </div>
          </div>
        )}

        {/* TAB 4: RECEIPT LIVE PREVIEW */}
        {activeTab === 'receipt' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Template selector pills */}
            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-neutral-900 block">Select Receipt Style</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'classic_thermal_80mm', label: 'Thermal 80mm' },
                  { id: 'compact_thermal_58mm', label: 'Compact 58mm' },
                  { id: 'modern_invoice_a5', label: 'Modern A5' },
                  { id: 'professional_invoice_a4', label: 'Invoice A4' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onTemplateChange(tpl.id as TemplateId)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all border ${
                      templateId === tpl.id
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Receipt Preview Component */}
            <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-sm bg-white">
              <ReceiptPreview
                restaurant={restaurant}
                details={details}
                items={items}
                gst={gst}
                style={style}
                templateId={templateId}
                calculated={calculated}
                onNewBill={onNewBill}
                onNotify={onNotify}
              />
            </div>
          </div>
        )}

        {/* TAB 5: STORE & RESTAURANT SETTINGS */}
        {activeTab === 'store' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Restaurant Profile Form */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <RestaurantDetailsForm
                restaurant={restaurant}
                onChange={onRestaurantChange}
                onSaveDefault={onSaveRestaurantDefault}
              />
            </div>

            {/* Style Selector */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <BillStyleSelector style={style} onChange={onStyleChange} />
            </div>

            {/* Reset Bill Option */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-neutral-900">Bill Management</h4>
              <button
                type="button"
                onClick={onResetBill}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Current Bill Items</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. FLOATING CHECKOUT STRIP (Visible on Order, Items & Tax tabs) */}
      {activeTab !== 'receipt' && (
        <div className="bg-white border-t border-neutral-200 px-3.5 py-2.5 flex items-center justify-between gap-2 shrink-0 shadow-lg">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Total Due</div>
            <div className="font-mono font-bold text-base text-neutral-950">
              ₹{calculated.grandTotal}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Download Bill Button */}
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              title="Download Bill as PDF"
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>PDF</span>
            </button>

            {/* Switch to Receipt Preview tab */}
            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className="flex items-center gap-1 px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. NATIVE MOBILE APP BOTTOM NAVIGATION BAR */}
      <div className="bg-white border-t border-neutral-200 px-2 py-1 flex items-center justify-around shrink-0 pb-safe">
        {[
          { id: 'order', label: 'Order', icon: Receipt },
          { id: 'items', label: 'Menu', icon: UtensilsCrossed, badge: totalItemCount },
          { id: 'tax', label: 'Tax', icon: Percent },
          { id: 'receipt', label: 'Receipt', icon: Eye },
          { id: 'store', label: 'Store', icon: Store },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950 stroke-[2.5]' : 'text-neutral-400'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-neutral-950 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* 6. VIRTUAL HOME INDICATOR (iOS style swipe bar) */}
      <div className="bg-white pt-0.5 pb-1 flex justify-center shrink-0">
        <div className="w-32 h-1 bg-neutral-300 rounded-full"></div>
      </div>
    </div>
  );

  // If phone mockup frame mode
  if (isPhoneFrame) {
    return (
      <div className="flex flex-col justify-center items-center py-2 sm:py-4 px-2">
        {/* Floating Mobile Clone Switcher Strip */}
        <div className="mb-2.5 flex items-center justify-between w-full max-w-[420px] px-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mobile App Clone</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPhoneFrame(false)}
              title="Expand to full width mobile view"
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-[11px] font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs"
            >
              Full View
            </button>

            {onExitMobile && (
              <button
                type="button"
                onClick={onExitMobile}
                title="Switch to Desktop Split View"
                className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-[11px] font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs"
              >
                Desktop View
              </button>
            )}
          </div>
        </div>

        {/* Realistic Mobile Device Mockup Frame (iPhone 16 Pro styling) */}
        <div className="w-full max-w-[420px] h-[860px] max-h-[92vh] bg-neutral-950 p-[10px] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] border-4 border-neutral-800 relative flex flex-col">
          {/* Side phone buttons simulation */}
          <div className="absolute -left-[14px] top-28 w-[4px] h-10 bg-neutral-700 rounded-l-md"></div>
          <div className="absolute -left-[14px] top-42 w-[4px] h-12 bg-neutral-700 rounded-l-md"></div>
          <div className="absolute -left-[14px] top-58 w-[4px] h-12 bg-neutral-700 rounded-l-md"></div>
          <div className="absolute -right-[14px] top-36 w-[4px] h-16 bg-neutral-700 rounded-r-md"></div>

          {/* Screen area with rounded corners */}
          <div className="w-full h-full rounded-[38px] overflow-hidden bg-white flex flex-col relative shadow-inner">
            {appContent}
          </div>
        </div>
      </div>
    );
  }

  // Full screen mobile mode (for actual phones or wide view)
  return (
    <div className="flex flex-col items-center py-2 sm:py-4 px-2">
      {/* Floating View Switcher Strip */}
      <div className="mb-2.5 flex items-center justify-between w-full max-w-lg px-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Mobile App Mode</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPhoneFrame(true)}
            title="Switch to Phone Mockup Frame"
            className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-[11px] font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs"
          >
            Phone Frame
          </button>

          {onExitMobile && (
            <button
              type="button"
              onClick={onExitMobile}
              title="Switch to Desktop Split View"
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-[11px] font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs"
            >
              Desktop View
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-lg min-h-[calc(100vh-120px)] flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden border border-neutral-200">
        {appContent}
      </div>
    </div>
  );
};
