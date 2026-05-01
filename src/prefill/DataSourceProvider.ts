import type { BlueprintGraph, DataElementGroup, PrefillMapping } from '@/types/graph';


export interface DataSourceProvider {
  readonly id: string;
  readonly label: string;

  
  getElementsFor(graph: BlueprintGraph, targetNodeId: string): DataElementGroup[];

  
  formatLabel?(mapping: PrefillMapping, graph: BlueprintGraph): string;
}
