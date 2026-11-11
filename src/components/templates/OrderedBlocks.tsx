import React from 'react';
import { LayoutBlockId } from '../../types/billing';
import { resolveLayoutOrder } from '../../utils/layoutOrder';

interface OrderedBlocksProps {
  order?: LayoutBlockId[];
  blocks: Record<LayoutBlockId, React.ReactNode>;
}

export const OrderedBlocks: React.FC<OrderedBlocksProps> = ({ order, blocks }) => (
  <>
    {resolveLayoutOrder(order).map((id) => (
      <React.Fragment key={id}>{blocks[id]}</React.Fragment>
    ))}
  </>
);
