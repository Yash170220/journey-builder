import type { BlueprintGraph, DataElementGroup, PrefillMapping } from '@/types/graph';
import type { DataSourceProvider } from './DataSourceProvider';
import { UpstreamFormsDataSource } from './UpstreamFormsDataSource';
import {
  DEFAULT_ACTION_PROPERTIES,
  DEFAULT_CLIENT_ORG_PROPERTIES,
  GlobalPropertiesDataSource,
} from './GlobalPropertiesDataSource';
import { UserPropertiesDataSource } from './UserPropertiesDataSource';


export class PrefillRegistry {
  private readonly providers: Map<string, DataSourceProvider>;

  constructor(providers: DataSourceProvider[]) {
    this.providers = new Map(providers.map((p) => [p.id, p]));
  }

  list(): DataSourceProvider[] {
    return [...this.providers.values()];
  }

  get(sourceId: string): DataSourceProvider | undefined {
    return this.providers.get(sourceId);
  }

  collectGroupsFor(graph: BlueprintGraph, targetNodeId: string): DataElementGroup[] {
    const out: DataElementGroup[] = [];
    for (const provider of this.providers.values()) {
      out.push(...provider.getElementsFor(graph, targetNodeId));
    }
    return out;
  }

  formatMappingLabel(mapping: PrefillMapping, graph: BlueprintGraph): string {
    const provider = this.providers.get(mapping.sourceId);
    if (provider?.formatLabel) return provider.formatLabel(mapping, graph);
    return mapping.label;
  }
}

export const DEFAULT_SOURCES: DataSourceProvider[] = [
  new UpstreamFormsDataSource(),
  new GlobalPropertiesDataSource('action_properties', 'Action Properties', [
    DEFAULT_ACTION_PROPERTIES,
  ]),
  new GlobalPropertiesDataSource(
    'client_org_properties',
    'Client Organisation Properties',
    [DEFAULT_CLIENT_ORG_PROPERTIES]
  ),
  new UserPropertiesDataSource({
    id: 'usr_demo_001',
    email: 'demo@avantos.ai',
    full_name: 'Demo User',
    role: 'advisor',
  }),
];

export const defaultRegistry = new PrefillRegistry(DEFAULT_SOURCES);
