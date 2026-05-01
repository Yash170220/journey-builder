import { describe, it, expect } from 'vitest';
import { defaultRegistry, PrefillRegistry } from './registry';
import { UpstreamFormsDataSource } from './UpstreamFormsDataSource';
import {
  GlobalPropertiesDataSource,
  DEFAULT_ACTION_PROPERTIES,
} from './GlobalPropertiesDataSource';
import { diamondGraph } from '@/lib/__fixtures__/diamondGraph';
import type { DataSourceProvider } from './DataSourceProvider';

describe('PrefillRegistry', () => {
  it('aggregates groups from every registered source', () => {
    const groups = defaultRegistry.collectGroupsFor(diamondGraph, 'D');
    const sourceIds = new Set(groups.map((g) => g.sourceId));
    expect(sourceIds.has('upstream_forms')).toBe(true);
    expect(sourceIds.has('action_properties')).toBe(true);
    expect(sourceIds.has('client_org_properties')).toBe(true);
    expect(sourceIds.has('user_properties')).toBe(true);
  });

  it('exposes form fields from direct AND transitive ancestors for D', () => {
    const groups = defaultRegistry.collectGroupsFor(diamondGraph, 'D');
    const upstreamGroups = groups.filter((g) => g.sourceId === 'upstream_forms');
    const labels = upstreamGroups.map((g) => g.groupLabel);
    // Direct: B, C   Transitive: A
    expect(labels).toContain('Form B');
    expect(labels).toContain('Form C');
    expect(labels.find((l) => l.startsWith('Form A'))).toMatch(/transitive/);
  });

  it('lets a new source plug in without changing other code', () => {
    const customSource: DataSourceProvider = {
      id: 'tenant_config',
      label: 'Tenant Config',
      getElementsFor: () => [
        {
          sourceId: 'tenant_config',
          groupId: 'tenant',
          groupLabel: 'Tenant Config',
          elements: [
            {
              path: 'tenant.region',
              label: 'Region',
              sourceId: 'tenant_config',
            },
          ],
        },
      ],
    };

    const customRegistry = new PrefillRegistry([
      new UpstreamFormsDataSource(),
      new GlobalPropertiesDataSource('action_properties', 'Action Properties', [
        DEFAULT_ACTION_PROPERTIES,
      ]),
      customSource,
    ]);

    const groups = customRegistry.collectGroupsFor(diamondGraph, 'D');
    expect(groups.some((g) => g.sourceId === 'tenant_config')).toBe(true);
  });

  it('formats upstream-form mapping label using the node name', () => {
    const label = defaultRegistry.formatMappingLabel(
      {
        targetNodeId: 'D',
        targetFieldKey: 'confirm',
        sourceId: 'upstream_forms',
        sourcePath: 'A.email',
        label: 'fallback',
      },
      diamondGraph
    );
    expect(label).toBe('Form A.email');
  });
});
