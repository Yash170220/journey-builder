import type { BlueprintGraph, DataElementGroup, PrefillMapping } from '@/types/graph';
import { findFormForNode, findNode, getAncestors } from '@/lib/dag';
import type { DataSourceProvider } from './DataSourceProvider';

export class UpstreamFormsDataSource implements DataSourceProvider {
  readonly id = 'upstream_forms';
  readonly label = 'Form fields';

  getElementsFor(graph: BlueprintGraph, targetNodeId: string): DataElementGroup[] {
    const { direct, transitive } = getAncestors(graph, targetNodeId);
    const groups: DataElementGroup[] = [];

    for (const id of direct) {
      const g = this.buildGroup(graph, id, false);
      if (g) groups.push(g);
    }
    for (const id of transitive) {
      const g = this.buildGroup(graph, id, true);
      if (g) groups.push(g);
    }
    return groups;
  }

  formatLabel(mapping: PrefillMapping, graph: BlueprintGraph): string {
    const [ancestorId, fieldKey] = mapping.sourcePath.split('.');
    const node = findNode(graph, ancestorId);
    return `${node?.data.name ?? ancestorId}.${fieldKey}`;
  }

  private buildGroup(
    graph: BlueprintGraph,
    ancestorNodeId: string,
    isTransitive: boolean
  ): DataElementGroup | null {
    const node = findNode(graph, ancestorNodeId);
    const form = findFormForNode(graph, ancestorNodeId);
    if (!node || !form) return null;

    const elements = Object.entries(form.field_schema.properties).map(
      ([fieldKey, prop]) => ({
        path: `${ancestorNodeId}.${fieldKey}`,
        label: prop.title ?? fieldKey,
        type: prop.type,
        sourceId: this.id,
      })
    );

    return {
      sourceId: this.id,
      groupId: ancestorNodeId,
      groupLabel: isTransitive ? `${node.data.name}  (transitive)` : node.data.name,
      elements,
    };
  }
}
