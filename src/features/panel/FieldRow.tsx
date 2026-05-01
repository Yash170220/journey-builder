import { useState } from 'react';
import type { PrefillMapping } from '@/types/graph';

interface FieldRowProps {
  fieldLabel: string;
  fieldType?: string;
  required?: boolean;
  mapping?: PrefillMapping;
  
  mappingLabel?: string;
  onOpenPicker: () => void;
  onClear: () => void;
}


export function FieldRow({
  fieldLabel,
  fieldType,
  required,
  mapping,
  mappingLabel,
  onOpenPicker,
  onClear,
}: FieldRowProps) {
  const [hoverClear, setHoverClear] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-4 border-b border-border last:border-b-0 hover:bg-white/[0.015]">
      <div className="min-w-0">
        <div className="text-zinc-200 truncate">
          {fieldLabel}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </div>
        {fieldType && <div className="text-xs text-zinc-500">{fieldType}</div>}
      </div>

      {mapping ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenPicker}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs hover:bg-accent/25"
            title="Change mapping"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {mappingLabel ?? mapping.label}
          </button>
          <button
            onClick={onClear}
            onMouseEnter={() => setHoverClear(true)}
            onMouseLeave={() => setHoverClear(false)}
            className={`px-1 ${hoverClear ? 'text-rose-400' : 'text-zinc-500'}`}
            title="Clear mapping"
            aria-label={`Clear prefill mapping for ${fieldLabel}`}
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenPicker}
          className="text-xs px-2 py-1 rounded border border-dashed border-zinc-700 text-zinc-400 hover:border-accent hover:text-accent shrink-0"
        >
          + Prefill
        </button>
      )}
    </div>
  );
}
