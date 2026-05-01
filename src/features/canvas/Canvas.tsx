import { useMemo } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useJourneyStore } from '@/store/journeyStore';
import { FormNode } from './FormNode';

const nodeTypes = { form: FormNode };

export function Canvas() {
  const graph = useJourneyStore((s) => s.graph);
  const selectedNodeId = useJourneyStore((s) => s.selectedNodeId);
  const selectNode = useJourneyStore((s) => s.selectNode);

  const nodes: Node[] = useMemo(() => {
    if (!graph) return [];
    return graph.nodes.map((n) => ({
      id: n.id,
      type: 'form',
      position: n.position,
      data: { ...n.data, isSelected: n.id === selectedNodeId },
    }));
  }, [graph, selectedNodeId]);

  const edges: Edge[] = useMemo(() => {
    if (!graph) return [];
    return graph.edges.map((e, i) => ({
      id: `${e.source}->${e.target}-${i}`,
      source: e.source,
      target: e.target,
      style: { stroke: '#52525b', strokeWidth: 1.5 },
    }));
  }, [graph]);

  if (!graph) return null;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => selectNode(node.id)}
      onPaneClick={() => selectNode(null)}
      fitView
      proOptions={{ hideAttribution: true }}
      colorMode="dark"
    >
      <Background gap={24} size={1} color="#27272a" />
      <Controls showInteractive={false} />
      <MiniMap
        pannable
        zoomable
        nodeColor="#3b82f6"
        maskColor="rgba(0,0,0,0.6)"
        className="!bg-panel"
      />
    </ReactFlow>
  );
}
