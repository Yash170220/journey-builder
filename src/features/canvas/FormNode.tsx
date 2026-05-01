import { Handle, Position } from '@xyflow/react';
import type { NodeData } from '@/types/graph';

interface FormNodeProps {
  data: NodeData & { isSelected?: boolean };
}

export function FormNode({ data }: FormNodeProps) {
  const selected = data.isSelected;
  return (
    <div
      className={[
        'rounded-md border bg-panel px-4 py-3 min-w-[180px] shadow-sm transition-colors',
        selected ? 'border-accent ring-2 ring-accent/30' : 'border-border',
      ].join(' ')}
    >
      <Handle type="target" position={Position.Left} className="!bg-zinc-500 !border-zinc-700" />
      <div className="text-[11px] uppercase tracking-wider text-zinc-500">Form</div>
      <div className="font-medium text-zinc-100 mt-0.5">{data.name}</div>
      <Handle type="source" position={Position.Right} className="!bg-zinc-500 !border-zinc-700" />
    </div>
  );
}
