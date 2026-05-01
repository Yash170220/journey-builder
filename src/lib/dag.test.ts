import { describe, it, expect } from 'vitest';
import { getAncestors, buildPredecessorMap } from './dag';
import { diamondGraph } from './__fixtures__/diamondGraph';

describe('buildPredecessorMap', () => {
  it('lists direct predecessors for each node', () => {
    const map = buildPredecessorMap(diamondGraph);
    expect(map.get('A')).toEqual([]);
    expect(map.get('B')).toEqual(['A']);
    expect(map.get('C')).toEqual(['A']);
    expect(map.get('D')?.sort()).toEqual(['B', 'C']);
  });
});

describe('getAncestors', () => {
  it('returns no ancestors for a root node', () => {
    const { direct, transitive } = getAncestors(diamondGraph, 'A');
    expect(direct).toEqual([]);
    expect(transitive).toEqual([]);
  });

  it('returns only direct parents for a one-hop node', () => {
    const { direct, transitive } = getAncestors(diamondGraph, 'B');
    expect(direct).toEqual(['A']);
    expect(transitive).toEqual([]);
  });

  it('dedupes shared ancestors in a diamond', () => {
    const { direct, transitive } = getAncestors(diamondGraph, 'D');
    expect(direct.sort()).toEqual(['B', 'C']);
    // A is reachable via both B and C but should appear once
    expect(transitive).toEqual(['A']);
  });

  it('does not infinite-loop on a cycle', () => {
    const cyclic = {
      ...diamondGraph,
      edges: [...diamondGraph.edges, { source: 'D', target: 'A' }],
    };
    const { direct, transitive } = getAncestors(cyclic, 'D');
    expect(direct.sort()).toEqual(['B', 'C']);
    expect(transitive).toEqual(['A']);
  });
});
