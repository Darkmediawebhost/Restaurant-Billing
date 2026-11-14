import React from 'react';
import { TemplateProps } from './ClassicThermal';
import { formatINR } from '../../utils/calculations';
import { DividerStyle } from '../../types/billing';
import { OrderedBlocks } from './OrderedBlocks';
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

const slipFont = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  color: '#000000',
} as const;

const tableStyle: React.CSSProperties = {
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  lineHeight: 1.15,
};

const lineCell: React.CSSProperties = { padding: 0, fontWeight: 400 };
const head: React.CSSProperties = { fontWeight: 700, padding: '1px 0', lineHeight: 1.15 };
const leftCell: React.CSSProperties = {
  textAlign: 'left',
  padding: 0,
  lineHeight: 1.15,
  wordBreak: 'break-word',
};
const centerCell: React.CSSProperties = {
  textAlign: 'center',
  padding: 0,
  lineHeight: 1.15,
  fontVariantNumeric: 'tabular-nums',
};
const rightCell: React.CSSProperties = {
  textAlign: 'right',
  padding: 0,
  lineHeight: 1.15,
  fontVariantNumeric: 'tabular-nums',
};

function Ink({ gap = 3, kind = 'solid' }: { gap?: number; kind?: DividerStyle }) {
  return <div style={ruleCss(kind, gap)} />;
}

function Cols() {
  return (
    <colgroup>
      <col />
      <col style={{ width: 32 }} />
      <col style={{ width: 52 }} />
      <col style={{ width: 58 }} />
    </colgroup>
  );
}

export const ExactSlip: React.FC<TemplateProps> = ({
  restaurant,
  details,
  items,
  gst,
  style,
  calculated,
}) => {
  const dine = diningLabel(details.diningType);
  const table =
    details.diningType === 'dine_in' && details.tableNumber
      ? details.tableNumber.replace(/^t-?/i, '')
      : '';
  const money = (value: number) => formatINR(value, false);
  const size = fontPx(style.fontSize);
  const line = style.dividerStyle;
  const align = style.headerAlignment === 'left' ? 'left' : 'center';

  return (
    <div
      className="w-[302px] bg-white px-[8px] pt-[6px] pb-[8px] select-none"
      style={{ ...slipFont, fontSize: size, lineHeight: style.styleVariant === 'compact' ? 1.05 : 1.15 }}
    >
      <OrderedBlocks
        order={style.layoutOrder}
        blocks={{
          logo:
            style.showLogo && restaurant.logoUrl ? (
              <div className="text-center" style={{ marginBottom: 4 }}>
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="inline-block object-contain"
                  style={{ height: 40, maxWidth: 130 }}
                />
              </div>
            ) : (
              <></>
            ),
          header: (
            <div style={{ textAlign: align }}>
              <h1 style={nameLook(style.styleVariant, size + 2)}>
                {restaurant.name || 'Restaurant Name'}
              </h1>
              {restaurant.address && (
                <p style={{ margin: '2px 0 0', whiteSpace: 'pre-line', lineHeight: 1.15 }}>
                  {restaurant.address}
                </p>
              )}
              {restaurant.phone && (
                <p style={{ margin: 0, lineHeight: 1.15 }}>Mob : {restaurant.phone}</p>
              )}
              {showGstLine(style, restaurant) && (
                <p style={{ margin: 0, fontSize: size, lineHeight: 1.15 }}>GST - {restaurant.gstin}</p>
              )}
              {showFssaiLine(style, restaurant) && (
                <p style={{ margin: 0, fontSize: size, lineHeight: 1.15 }}>FSSAI - {restaurant.fssai}</p>
              )}
              <Ink gap={4} kind={line} />
            </div>
          ),
          details: (
            <div>
              <p style={{ margin: '2px 0', lineHeight: 1.15 }}>
                Name: {details.customerName || ''}
              </p>
              <Ink gap={0} kind={line} />
              <div style={{ padding: '2px 0', lineHeight: 1.15 }}>
                <div className="flex items-baseline justify-between gap-3">
                  <p style={{ margin: 0, lineHeight: 1.15 }}>Date: {slipDate(details.date)}</p>
                  <p style={{ margin: 0, fontSize: size + 1, fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                    {dine}
                    {table ? `: ${table}` : ''}
                  </p>
                </div>
                {style.showBillTime && details.time ? (
                  <p style={{ margin: 0, lineHeight: 1.15 }}>{details.time}</p>
                ) : null}
                <div className="flex items-baseline justify-between gap-3">
                  <p style={{ margin: 0, lineHeight: 1.15 }}>
                    {style.showCashier && details.cashier ? `Cashier: ${details.cashier}` : ''}
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.15, whiteSpace: 'nowrap' }}>
                    Bill No.: {details.billNumber}
                  </p>
                </div>
              </div>
              <Ink gap={1} kind={line} />
            </div>
          ),
          items: (
            <table style={tableStyle}>
              <Cols />
              <thead>
                <tr>
                  <th style={{ ...head, textAlign: 'left' }}>Item</th>
                  <th style={{ ...head, textAlign: 'center' }}>Qty.</th>
                  <th style={{ ...head, textAlign: 'right' }}>Price</th>
                  <th style={{ ...head, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index} style={{ verticalAlign: 'top' }}>
                    <td style={{ ...leftCell, paddingRight: 6 }}>{item.name || 'Item'}</td>
                    <td style={centerCell}>{item.quantity}</td>
                    <td style={rightCell}>{money(item.unitPrice)}</td>
                    <td style={rightCell}>{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ),
          totals: (
            <table style={{ ...tableStyle, marginTop: 8 }}>
              <Cols />
              <tbody>
                <tr style={{ verticalAlign: 'top' }}>
                  <td colSpan={2} style={{ ...rightCell, whiteSpace: 'nowrap', paddingRight: 6 }}>
                    Total Qty: {calculated.totalQuantity}
                  </td>
                  <td style={{ ...leftCell, lineHeight: 1.05 }}>
                    Sub
                    <br />
                    Total
                  </td>
                  <td style={rightCell}>{money(calculated.grossAmount)}</td>
                </tr>
                {calculated.discountAmount > 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...rightCell, paddingRight: 6 }}>
                      Discount
                      {calculated.discountType === 'percentage' ? ` ${calculated.discountValue}%` : ''}
                    </td>
                    <td style={rightCell}>-{money(calculated.discountAmount)}</td>
                  </tr>
                )}
                {gst.enabled && calculated.totalTax > 0 && gst.taxType === 'intrastate' && (
                  <>
                    <tr>
                      <td colSpan={3} style={{ ...rightCell, paddingRight: 6 }}>
                        CGST {calculated.cgstRate}%
                      </td>
                      <td style={rightCell}>{money(calculated.cgstAmount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ ...rightCell, paddingRight: 6 }}>
                        SGST {calculated.sgstRate}%
                      </td>
                      <td style={rightCell}>{money(calculated.sgstAmount)}</td>
                    </tr>
                  </>
                )}
                {gst.enabled && calculated.totalTax > 0 && gst.taxType !== 'intrastate' && (
                  <tr>
                    <td colSpan={3} style={{ ...rightCell, paddingRight: 6 }}>
                      IGST {calculated.igstRate}%
                    </td>
                    <td style={rightCell}>{money(calculated.igstAmount)}</td>
                  </tr>
                )}
                {calculated.roundOff !== 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...rightCell, paddingRight: 6 }}>
                      Round Off
                    </td>
                    <td style={rightCell}>{money(calculated.roundOff)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={4} style={lineCell}>
                    <Ink gap={4} kind={line} />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ ...rightCell, textAlign: 'center', fontWeight: style.styleVariant === 'bold' ? 800 : 700, fontSize: size + 2, paddingTop: 2 }}>
                    Grand Total
                  </td>
                  <td style={{ ...rightCell, fontWeight: style.styleVariant === 'bold' ? 800 : 700, fontSize: size + 3, paddingTop: 2 }}>
                    ₹ {money(calculated.grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          ),
          footer: (
            <p className="text-center" style={{ margin: '6px 0 0', fontWeight: 400, lineHeight: 1.15 }}>
              {slipFooter(restaurant.footerMessage || style.footerMessage || '')}
            </p>
          ),
        }}
      />
    </div>
  );
};
