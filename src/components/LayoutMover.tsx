import React, { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, RotateCcw } from 'lucide-react';
import { BillStyle, DEFAULT_LAYOUT_ORDER, LayoutBlockId } from '../types/billing';
import { LAYOUT_BLOCK_LABELS, moveLayoutBlock, reorderLayoutBlock, resolveLayoutOrder } from '../utils/layoutOrder';

interface LayoutMoverProps {
  style: BillStyle;
  onChange: (style: BillStyle) => void;
}

export const LayoutMover: React.FC<LayoutMoverProps> = ({ style, onChange }) => {
  const order = resolveLayoutOrder(style.layoutOrder);
  const [dragId, setDragId] = useState<LayoutBlockId | null>(null);

  const commit = (next: LayoutBlockId[]) => {
    onChange({ ...style, layoutOrder: next });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Move bill layout</h3>
          <p className="text-xs text-neutral-500">
            Drag a block, or use the arrows, to change its place. This applies to every template.
          </p>
        </div>
        <button
          type="button"
          onClick={() => commit([...DEFAULT_LAYOUT_ORDER])}
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-200"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <ol className="space-y-2">
        {order.map((id, index) => (
          <li
            key={id}
            draggable
            onDragStart={() => setDragId(id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!dragId) return;
              commit(reorderLayoutBlock(order, dragId, id));
              setDragId(null);
            }}
            onDragEnd={() => setDragId(null)}
            className={`flex items-center gap-2 rounded-xl border px-2 py-2 ${
              dragId === id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 bg-white'
            }`}
          >
            <span className="text-neutral-400 cursor-grab active:cursor-grabbing p-1" title="Drag to move">
              <GripVertical className="w-4 h-4" />
            </span>
            <span className="w-6 text-xs font-mono text-neutral-400">{index + 1}</span>
            <span className="flex-1 text-sm font-medium text-neutral-900">{LAYOUT_BLOCK_LABELS[id]}</span>
            <button
              type="button"
              aria-label={`Move ${LAYOUT_BLOCK_LABELS[id]} up`}
              disabled={index === 0}
              onClick={() => commit(moveLayoutBlock(order, id, -1))}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={`Move ${LAYOUT_BLOCK_LABELS[id]} down`}
              disabled={index === order.length - 1}
              onClick={() => commit(moveLayoutBlock(order, id, 1))}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};
