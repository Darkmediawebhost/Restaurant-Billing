import { BillItem, DiscountType, GSTConfig, BillCalculations } from '../types/billing';

/**
 * Format currency amount into Indian Rupee (INR) representation.
 * e.g. formatINR(450.5) => "₹450.50"
 */
export function formatINR(val: number | undefined | null, showSymbol = true): string {
  const num = typeof val === 'number' && !isNaN(val) ? val : 0;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Formats a plain 2-decimal number string.
 */
export function toDecimal(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Computes all billing figures including items, discount, intrastate/interstate GST,
 * inclusive vs exclusive tax treatment, and round off.
 */
export function calculateBill(
  items: BillItem[],
  discountType: DiscountType,
  discountValue: number,
  gst: GSTConfig
): BillCalculations {
  // 1. Total Quantity and Gross Amount
  let totalQuantity = 0;
  let grossAmount = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity || 0);
    const price = Math.max(0, item.unitPrice || 0);
    totalQuantity += qty;
    grossAmount += qty * price;
  }
  grossAmount = toDecimal(grossAmount);

  // 2. Discount Calculation
  let discountAmount = 0;
  const cleanDiscountVal = Math.max(0, discountValue || 0);

  if (discountType === 'percentage') {
    const pct = Math.min(100, cleanDiscountVal);
    discountAmount = toDecimal((grossAmount * pct) / 100);
  } else {
    discountAmount = toDecimal(Math.min(grossAmount, cleanDiscountVal));
  }

  const amountAfterDiscount = Math.max(0, toDecimal(grossAmount - discountAmount));

  // 3. GST Calculation
  let netTaxableAmount = amountAfterDiscount;
  let taxRate = 0;
  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;
  let totalTax = 0;
  let rawGrandTotal = amountAfterDiscount;

  if (gst.enabled && gst.rate > 0) {
    taxRate = gst.rate;

    if (gst.taxTreatment === 'inclusive') {
      // Amount already contains tax
      // Taxable = Amount / (1 + Rate / 100)
      netTaxableAmount = toDecimal(amountAfterDiscount / (1 + taxRate / 100));
      totalTax = toDecimal(amountAfterDiscount - netTaxableAmount);
      rawGrandTotal = amountAfterDiscount;
    } else {
      // Tax exclusive: tax is added on top of taxable amount
      netTaxableAmount = amountAfterDiscount;
      totalTax = toDecimal((netTaxableAmount * taxRate) / 100);
      rawGrandTotal = toDecimal(netTaxableAmount + totalTax);
    }

    if (gst.taxType === 'intrastate') {
      // Split 50-50 into CGST & SGST
      cgstRate = toDecimal(taxRate / 2);
      sgstRate = toDecimal(taxRate / 2);
      cgstAmount = toDecimal(totalTax / 2);
      // Ensure sgst + cgst precisely equal totalTax
      sgstAmount = toDecimal(totalTax - cgstAmount);
    } else {
      // Interstate: 100% IGST
      igstRate = taxRate;
      igstAmount = totalTax;
    }
  }

  // 4. Optional standard round-off to nearest rupee
  const grandTotalRounded = Math.round(rawGrandTotal);
  const roundOff = toDecimal(grandTotalRounded - rawGrandTotal);

  return {
    totalQuantity,
    grossAmount,
    discountType,
    discountValue: cleanDiscountVal,
    discountAmount,
    netTaxableAmount,
    taxRate,
    taxType: gst.taxType,
    isTaxInclusive: gst.enabled && gst.taxTreatment === 'inclusive',
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalTax,
    rawGrandTotal,
    roundOff,
    grandTotal: grandTotalRounded,
  };
}

/**
 * Validates standard Indian GSTIN format (15 characters: 2 state + 10 PAN + 1 entity + 1 'Z' + 1 checksum)
 */
export function validateGSTIN(gstin: string): { isValid: boolean; message?: string } {
  const trimmed = gstin.trim().toUpperCase();
  if (!trimmed) return { isValid: true };
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(trimmed)) {
    return {
      isValid: false,
      message: 'Format should be 15 alphanumeric characters (e.g. 27AAAAA0000A1Z5)',
    };
  }
  return { isValid: true };
}

/**
 * Validates Indian FSSAI License number (14 digits)
 */
export function validateFSSAI(fssai: string): { isValid: boolean; message?: string } {
  const trimmed = fssai.trim();
  if (!trimmed) return { isValid: true };
  const fssaiRegex = /^[0-9]{14}$/;
  if (!fssaiRegex.test(trimmed)) {
    return {
      isValid: false,
      message: 'FSSAI License must be exactly 14 digits',
    };
  }
  return { isValid: true };
}
