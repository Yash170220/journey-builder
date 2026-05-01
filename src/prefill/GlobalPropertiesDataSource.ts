import type { BlueprintGraph, DataElementGroup, PrefillMapping } from '@/types/graph';
import type { DataSourceProvider } from './DataSourceProvider';

export interface GlobalPropertyGroupConfig {
  groupId: string;
  groupLabel: string;
  properties: { key: string; label: string; type?: string }[];
}


export class GlobalPropertiesDataSource implements DataSourceProvider {
  readonly id: string;
  readonly label: string;

  constructor(
    id: string,
    label: string,
    private readonly groups: GlobalPropertyGroupConfig[]
  ) {
    this.id = id;
    this.label = label;
  }

  getElementsFor(_graph: BlueprintGraph, _targetNodeId: string): DataElementGroup[] {
    return this.groups.map((group) => ({
      sourceId: this.id,
      groupId: group.groupId,
      groupLabel: group.groupLabel,
      elements: group.properties.map((p) => ({
        path: `${group.groupId}.${p.key}`,
        label: p.label,
        type: p.type,
        sourceId: this.id,
      })),
    }));
  }

  formatLabel(mapping: PrefillMapping): string {
    return mapping.label;
  }
}



export const DEFAULT_ACTION_PROPERTIES: GlobalPropertyGroupConfig = {
  groupId: 'action_properties',
  groupLabel: 'Action Properties',
  properties: [
    { key: 'action_id', label: 'Action ID', type: 'string' },
    { key: 'action_name', label: 'Action Name', type: 'string' },
    { key: 'started_at', label: 'Started At', type: 'string' },
  ],
};

export const DEFAULT_CLIENT_ORG_PROPERTIES: GlobalPropertyGroupConfig = {
  groupId: 'client_org_properties',
  groupLabel: 'Client Organisation Properties',
  properties: [
    { key: 'org_id', label: 'Organisation ID', type: 'string' },
    { key: 'org_name', label: 'Organisation Name', type: 'string' },
    { key: 'tenant_id', label: 'Tenant ID', type: 'string' },
  ],
};
