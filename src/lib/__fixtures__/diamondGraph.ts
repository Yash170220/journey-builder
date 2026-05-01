import type { BlueprintGraph } from '@/types/graph';

/**
 * A minimal fixture: A -> B -> D and A -> C -> D (diamond).
 * Useful for verifying transitive-ancestor traversal dedupes correctly.
 */
export const diamondGraph: BlueprintGraph = {
  id: 'bp_test',
  name: 'Test Blueprint',
  nodes: [
    { id: 'A', type: 'form', position: { x: 0, y: 0 }, data: makeNodeData('A', 'fA') },
    { id: 'B', type: 'form', position: { x: 200, y: -100 }, data: makeNodeData('B', 'fB') },
    { id: 'C', type: 'form', position: { x: 200, y: 100 }, data: makeNodeData('C', 'fC') },
    { id: 'D', type: 'form', position: { x: 400, y: 0 }, data: makeNodeData('D', 'fD') },
  ],
  edges: [
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'C', target: 'D' },
  ],
  forms: [
    makeForm('fA', { name: 'string', email: 'string' }),
    makeForm('fB', { dob: 'string' }),
    makeForm('fC', { ssn: 'string' }),
    makeForm('fD', { confirm: 'boolean' }),
  ],
};

function makeNodeData(name: string, formId: string) {
  return {
    id: `n_${name}`,
    component_key: `key_${name}`,
    component_type: 'form',
    component_id: formId,
    name: `Form ${name}`,
    prerequisites: [],
  };
}

function makeForm(id: string, props: Record<string, string>) {
  return {
    id,
    name: id,
    field_schema: {
      type: 'object' as const,
      properties: Object.fromEntries(
        Object.entries(props).map(([k, t]) => [k, { type: t, title: k }])
      ),
    },
  };
}
