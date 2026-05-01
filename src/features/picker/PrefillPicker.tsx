import { useMemo, useState } from 'react';
import type { BlueprintGraph, DataElementGroup, PrefillMapping } from '@/types/graph';
import { defaultRegistry } from '@/prefill/registry';

interface PrefillPickerProps {
  graph: BlueprintGraph;
  targetNodeId: string;
  targetFieldKey: string;
  targetFieldLabel: string;
  onSelect: (mapping: PrefillMapping) => void;
  onClose: () => void;
}


export function PrefillPicker({
  graph,
  targetNodeId,
  targetFieldKey,
  targetFieldLabel,
  onSelect,
  onClose,
}: PrefillPickerProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<PrefillMapping | null>(null);

  const groups = useMemo<DataElementGroup[]>(
    () => defaultRegistry.collectGroupsFor(graph, targetNodeId),
    [graph, targetNodeId]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        elements: g.elements.filter(
          (e) => e.label.toLowerCase().includes(q) || e.path.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.elements.length > 0);
  }, [groups, search]);

  const toggle = (key: string) =>
    setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const handlePick = (
    group: DataElementGroup,
    element: DataElementGroup['elements'][number]
  ) => {
    setPending({
      targetNodeId,
      targetFieldKey,
      sourceId: element.sourceId,
      sourcePath: element.path,
      label: `${group.groupLabel} / ${element.label}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-[560px] max-h-[80vh] flex flex-col rounded-lg border border-border bg-panel shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Select data element
          </div>
          <div className="text-zinc-100 mt-1">
            Prefill <span className="font-medium">{targetFieldLabel}</span>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-border">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full bg-canvas border border-border rounded px-3 py-1.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-5 py-6 text-zinc-500 text-center">
              No data elements available.
            </div>
          )}
          {filtered.map((group) => {
            const key = `${group.sourceId}:${group.groupId}`;
            // expand groups by default while a search is active so matches are visible
            const isOpen = expanded[key] ?? !!search;
            return (
              <div key={key} className="border-b border-border last:border-b-0">
                <button
                  className="w-full text-left px-5 py-2.5 hover:bg-white/[0.02] flex items-center justify-between"
                  onClick={() => toggle(key)}
                >
                  <span className="text-zinc-200">{group.groupLabel}</span>
                  <span className="text-zinc-500 text-xs">
                    {isOpen ? '▾' : '▸'} {group.elements.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-2">
                    {group.elements.map((el) => {
                      const isPending =
                        pending?.sourceId === el.sourceId &&
                        pending?.sourcePath === el.path;
                      return (
                        <button
                          key={el.path}
                          onClick={() => handlePick(group, el)}
                          className={[
                            'w-full text-left pl-9 pr-5 py-1.5 flex items-center justify-between',
                            isPending
                              ? 'bg-accent/15 text-accent'
                              : 'text-zinc-300 hover:bg-white/[0.03]',
                          ].join(' ')}
                        >
                          <span>{el.label}</span>
                          {el.type && (
                            <span className="text-xs text-zinc-500">{el.type}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-border text-zinc-300 hover:bg-white/[0.03]"
          >
            Cancel
          </button>
          <button
            onClick={() => pending && onSelect(pending)}
            disabled={!pending}
            className="px-3 py-1.5 rounded bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
