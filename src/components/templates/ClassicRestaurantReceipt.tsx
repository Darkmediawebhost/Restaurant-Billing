import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { DividerStyle } from '../../types/billing';
import { fontPx, nameLook, ruleCss, showFssaiLine, showGstLine } from './templateUtils';

function slipDate(iso: string): string {
  const [year, month, day] = (iso || '').split('-');
  if (!year || !month || !day) return iso || '';
  return `${day}/${month}/${year.slice(-2)}`;
}

function diningLabel(type: string): string {
  if (type === 'takeaway') return 'Takeaway';
  if (type === 'delivery') return 'Delivery';
  return 'Dine In';
}

function slipFooter(message: string): string {
  const text = message.trim();
  if (!text) return '***Thank You Visit Again***';
  if (text.startsWith('*')) return text;
  return `***${text}***`;
}

function Ink({ gap = 3, kind = 'solid' }: { gap?: number; kind?: DividerStyle }) {
  return <div style={ruleCss(kind, gap)} />;
}

export const ClassicRestaurantReceipt: React.FC<TemplateProps & { narrow?: boolean }> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
  narrow = false,
}) => {
  const dine = diningLabel(details.diningType);
  const table =
    details.diningType === 'dine_in' && details.tableNumber
      ? details.tableNumber.replace(/^t-?/i, '')
      : '';
  const money = (value: number) => formatINR(value, false);
  const size = fontPx(style.fontSize, narrow);
  const line = style.dividerStyle;
  const align = style.headerAlignment === 'left' ? 'left' : 'center';
  const tight = style.styleVariant === 'compact';
  const qtyW = narrow ? 24 : 32;
  const priceW = narrow ? 42 : 52;
  const amountW = narrow ? 46 : 58;

  const cell = (align: 'left' | 'center' | 'right'): React.CSSProperties => ({
    textAlign: align,
    padding: 0,
    fontSize: size,
    lineHeight: 1.15,
    fontVariantNumeric: 'tabular-nums',
    wordBreak: 'break-word',
  });

  return (
    <div
      className="bg-white text-black select-none"
      style={{
        width: narrow ? 219 : 302,
        padding: tight ? '4px 6px 6px' : narrow ? '5px 6px 7px' : '6px 8px 8px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: size,
        lineHeight: tight ? 1.05 : 1.15,
        color: '#000000',
      }}
    >
      <div style={{ textAlign: align }}>
        {style.showLogo && restaurant.logoUrl ? (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            style={{ height: narrow ? 32 : 40, maxWidth: narrow ? 100 : 130, objectFit: 'contain', marginBottom: 3 }}
          />
        ) : null}
        <h1 style={nameLook(style.styleVariant, size + (narrow ? 1 : 2))}>
          {restaurant.name || 'Restaurant Name'}
        </h1>
        {restaurant.address ? (
          <p style={{ margin: '2px 0 0', whiteSpace: 'pre-line' }}>{restaurant.address}</p>
        ) : null}
        {restaurant.phone ? <p style={{ margin: 0 }}>Mob : {restaurant.phone}</p> : null}
        {showGstLine(style, restaurant) ? <p style={{ margin: 0 }}>GST - {restaurant.gstin}</p> : null}
        {showFssaiLine(style, restaurant) ? <p style={{ margin: 0 }}>FSSAI - {restaurant.fssai}</p> : null}
        <Ink gap={4} kind={line} />
      </div>

      <p style={{ margin: '2px 0' }}>Name: {details.customerName || ''}</p>
      <Ink gap={0} kind={line} />

      <div style={{ padding: '2px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <p style={{ margin: 0 }}>Date: {slipDate(details.date)}</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: size + 1, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
            {dine}
            {table ? `: ${table}` : ''}
          </p>
        </div>
        {style.showBillTime && details.time ? <p style={{ margin: 0 }}>{details.time}</p> : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <p style={{ margin: 0 }}>{style.showCashier && details.cashier ? `Cashier: ${details.cashier}` : ''}</p>
          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Bill No.: {details.billNumber}</p>
        </div>
      </div>
      <Ink gap={1} kind={line} />

      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop: 2 }}>
        <colgroup>
          <col />
          <col style={{ width: qtyW }} />
          <col style={{ width: priceW }} />
          <col style={{ width: amountW }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...cell('left'), fontWeight: 700 }}>Item</th>
            <th style={{ ...cell('center'), fontWeight: 700 }}>Qty.</th>
            <th style={{ ...cell('right'), fontWeight: 700 }}>Price</th>
            <th style={{ ...cell('right'), fontWeight: 700 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || index} style={{ verticalAlign: 'top' }}>
              <td style={{ ...cell('left'), paddingRight: 4 }}>{item.name || 'Item'}</td>
              <td style={cell('center')}>{item.quantity}</td>
              <td style={cell('right')}>{money(item.unitPrice)}</td>
              <td style={cell('right')}>{money(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop: 6 }}>
        <colgroup>
          <col />
          <col style={{ width: qtyW }} />
          <col style={{ width: priceW }} />
          <col style={{ width: amountW }} />
        </colgroup>
        <tbody>
          <tr style={{ verticalAlign: 'top' }}>
            <td colSpan={2} style={{ ...cell('right'), whiteSpace: 'nowrap', paddingRight: 4 }}>
              Total Qty: {calculated.totalQuantity}
            </td>
            <td style={{ ...cell('left'), lineHeight: 1.05 }}>
              Sub
              <br />
              Total
            </td>
            <td style={cell('right')}>{money(calculated.grossAmount)}</td>
          </tr>
          {calculated.discountAmount > 0 && (
            <tr>
              <td colSpan={3} style={{ ...cell('right'), paddingRight: 4 }}>
                Discount
                {calculated.discountType === 'percentage' ? ` ${calculated.discountValue}%` : ''}
              </td>
              <td style={cell('right')}>-{money(calculated.discountAmount)}</td>
            </tr>
          )}
          {gst.enabled && calculated.totalTax > 0 && gst.taxType === 'intrastate' && (
            <>
              <tr>
                <td colSpan={3} style={{ ...cell('right'), paddingRight: 4 }}>
                  CGST {calculated.cgstRate}%
                </td>
                <td style={cell('right')}>{money(calculated.cgstAmount)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ ...cell('right'), paddingRight: 4 }}>
                  SGST {calculated.sgstRate}%
                </td>
                <td style={cell('right')}>{money(calculated.sgstAmount)}</td>
              </tr>
            </>
          )}
          {gst.enabled && calculated.totalTax > 0 && gst.taxType !== 'intrastate' && (
            <tr>
              <td colSpan={3} style={{ ...cell('right'), paddingRight: 4 }}>
                IGST {calculated.igstRate}%
              </td>
              <td style={cell('right')}>{money(calculated.igstAmount)}</td>
            </tr>
          )}
          {calculated.roundOff !== 0 && (
            <tr>
              <td colSpan={3} style={{ ...cell('right'), paddingRight: 4 }}>
                Round Off
              </td>
              <td style={cell('right')}>{money(calculated.roundOff)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Ink gap={4} kind={line} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 2 }}>
        <span style={{ fontWeight: style.styleVariant === 'bold' ? 800 : 700, fontSize: size + 2, paddingLeft: narrow ? 8 : 24 }}>Grand Total</span>
        <span style={{ fontWeight: style.styleVariant === 'bold' ? 800 : 700, fontSize: size + 3, fontVariantNumeric: 'tabular-nums' }}>
          ₹ {money(calculated.grandTotal)}
        </span>
      </div>
      <p style={{ margin: '6px 0 0', textAlign: 'center', fontSize: size, fontWeight: 400 }}>
        {slipFooter(restaurant.footerMessage || style.footerMessage || '')}
      </p>
    </div>
  );
};
