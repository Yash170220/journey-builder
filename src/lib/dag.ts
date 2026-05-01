import type { BlueprintGraph, GraphNode } from '@/types/graph';


export function buildPredecessorMap(graph: BlueprintGraph): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const node of graph.nodes) map.set(node.id, []);

  for (const edge of graph.edges) {
    const list = map.get(edge.target) ?? [];
    if (!list.includes(edge.source)) list.push(edge.source);
    map.set(edge.target, list);
  }
  return map;
}


export function getAncestors(
  graph: BlueprintGraph,
  nodeId: string
): { direct: string[]; transitive: string[] } {
  const preds = buildPredecessorMap(graph);
  const direct = preds.get(nodeId) ?? [];

  const visited = new Set<string>([nodeId, ...direct]);
  const transitive: string[] = [];
  const queue = [...direct];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const parent of preds.get(current) ?? []) {
      if (!visited.has(parent)) {
        visited.add(parent);
        transitive.push(parent);
        queue.push(parent);
      }
    }
  }

  return { direct, transitive };
}

export function findNode(graph: BlueprintGraph, nodeId: string): GraphNode | undefined {
  return graph.nodes.find((n) => n.id === nodeId);
}

export function findFormForNode(graph: BlueprintGraph, nodeId: string) {
  const node = findNode(graph, nodeId);
  if (!node) return undefined;
  return graph.forms.find((f) => f.id === node.data.component_id);
}
