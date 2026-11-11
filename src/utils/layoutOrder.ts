import { DEFAULT_LAYOUT_ORDER, LayoutBlockId } from '../types/billing';

export const LAYOUT_BLOCK_LABELS: Record<LayoutBlockId, string> = {
  logo: 'Restaurant logo',
  header: 'Name, address and phone',
  details: 'Bill number, date and table',
  items: 'Food items',
  totals: 'Tax and grand total',
  footer: 'Footer message',
};

const BLOCK_SET = new Set<string>(DEFAULT_LAYOUT_ORDER);

export function resolveLayoutOrder(order?: LayoutBlockId[]): LayoutBlockId[] {
  const saved = (order || []).filter((id): id is LayoutBlockId => BLOCK_SET.has(id));
  const missing = DEFAULT_LAYOUT_ORDER.filter((id) => !saved.includes(id));
  return saved.length ? [...saved, ...missing] : [...DEFAULT_LAYOUT_ORDER];
}

export function moveLayoutBlock(
  order: LayoutBlockId[],
  id: LayoutBlockId,
  direction: -1 | 1
): LayoutBlockId[] {
  const next = [...order];
  const index = next.indexOf(id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= next.length) return next;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export function reorderLayoutBlock(
  order: LayoutBlockId[],
  fromId: LayoutBlockId,
  toId: LayoutBlockId
): LayoutBlockId[] {
  if (fromId === toId) return order;
  const next = [...order];
  const from = next.indexOf(fromId);
  const to = next.indexOf(toId);
  if (from < 0 || to < 0) return order;
  next.splice(from, 1);
  next.splice(to, 0, fromId);
  return next;
}
