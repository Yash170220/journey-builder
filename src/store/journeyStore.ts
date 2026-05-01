import { create } from 'zustand';
import type { BlueprintGraph, PrefillMapping } from '@/types/graph';
import { fetchBlueprintGraph } from '@/services/api';

interface JourneyState {
  graph: BlueprintGraph | null;
  loading: boolean;
  error: string | null;

  selectedNodeId: string | null;

  
  mappings: Record<string, PrefillMapping>;

  loadGraph: () => Promise<void>;
  selectNode: (nodeId: string | null) => void;
  setMapping: (mapping: PrefillMapping) => void;
  clearMapping: (nodeId: string, fieldKey: string) => void;
}

const mappingKey = (nodeId: string, fieldKey: string) => `${nodeId}.${fieldKey}`;

export const useJourneyStore = create<JourneyState>((set) => ({
  graph: null,
  loading: false,
  error: null,
  selectedNodeId: null,
  mappings: {},

  loadGraph: async () => {
    set({ loading: true, error: null });
    try {
      const graph = await fetchBlueprintGraph();
      set({ graph, loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), loading: false });
    }
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setMapping: (mapping) =>
    set((state) => ({
      mappings: {
        ...state.mappings,
        [mappingKey(mapping.targetNodeId, mapping.targetFieldKey)]: mapping,
      },
    })),

  clearMapping: (nodeId, fieldKey) =>
    set((state) => {
      const next = { ...state.mappings };
      delete next[mappingKey(nodeId, fieldKey)];
      return { mappings: next };
    }),
}));
