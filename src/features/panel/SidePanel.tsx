import { useState } from 'react';
import { useJourneyStore } from '@/store/journeyStore';
import { findFormForNode, findNode } from '@/lib/dag';
import { defaultRegistry } from '@/prefill/registry';
import { FieldRow } from './FieldRow';
import { PrefillPicker } from '@/features/picker/PrefillPicker';


export function SidePanel() {
  const graph = useJourneyStore((s) => s.graph);
  const selectedNodeId = useJourneyStore((s) => s.selectedNodeId);
  const selectNode = useJourneyStore((s) => s.selectNode);
  const mappings = useJourneyStore((s) => s.mappings);
  const setMapping = useJourneyStore((s) => s.setMapping);
  const clearMapping = useJourneyStore((s) => s.clearMapping);

  // which field's picker is open, or null if none
  const [pickerField, setPickerField] = useState<{ key: string; label: string } | null>(
    null
  );

  if (!graph || !selectedNodeId) {
    return (
      <aside className="w-[380px] border-l border-border bg-panel flex items-center justify-center text-zinc-500 text-sm">
        Select a node to configure prefill
      </aside>
    );
  }

  const node = findNode(graph, selectedNodeId);
  const form = findFormForNode(graph, selectedNodeId);

  if (!node || !form) {
    return (
      <aside className="w-[380px] border-l border-border bg-panel flex items-center justify-center text-zinc-500 text-sm">
        Form definition not found.
      </aside>
    );
  }

  const fields = Object.entries(form.field_schema.properties);
  const required = new Set(form.field_schema.required ?? []);

  return (
    <aside className="w-[380px] border-l border-border bg-panel flex flex-col">
      <div className="px-4 py-4 border-b border-border flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">Form</div>
          <div className="text-zinc-100 font-medium truncate mt-0.5">{node.data.name}</div>
          {form.description && (
            <div className="text-xs text-zinc-500 mt-1 line-clamp-2">{form.description}</div>
          )}
        </div>
        <button
          onClick={() => selectNode(null)}
          className="text-zinc-500 hover:text-zinc-200 ml-2"
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-zinc-500 border-b border-border">
        Prefill ({fields.length})
      </div>

      <div className="flex-1 overflow-y-auto">
        {fields.length === 0 ? (
          <div className="p-4 text-zinc-500 text-sm">No fields on this form.</div>
        ) : (
          fields.map(([fieldKey, prop]) => {
            const mapping = mappings[`${selectedNodeId}.${fieldKey}`];
            const mappingLabel = mapping
              ? defaultRegistry.formatMappingLabel(mapping, graph)
              : undefined;

            return (
              <FieldRow
                key={fieldKey}
                fieldLabel={prop.title ?? fieldKey}
                fieldType={prop.type}
                required={required.has(fieldKey)}
                mapping={mapping}
                mappingLabel={mappingLabel}
                onOpenPicker={() =>
                  setPickerField({ key: fieldKey, label: prop.title ?? fieldKey })
                }
                onClear={() => clearMapping(selectedNodeId, fieldKey)}
              />
            );
          })
        )}
      </div>

      {pickerField && (
        <PrefillPicker
          graph={graph}
          targetNodeId={selectedNodeId}
          targetFieldKey={pickerField.key}
          targetFieldLabel={pickerField.label}
          onSelect={(mapping) => {
            setMapping(mapping);
            setPickerField(null);
          }}
          onClose={() => setPickerField(null)}
        />
      )}
    </aside>
  );
}
