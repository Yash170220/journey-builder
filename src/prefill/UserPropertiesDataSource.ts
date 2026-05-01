import type {
  BlueprintGraph,
  DataElementGroup,
  PrefillMapping,
} from '@/types/graph';
import type { DataSourceProvider } from './DataSourceProvider';


export interface CurrentUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export class UserPropertiesDataSource implements DataSourceProvider {
  readonly id = 'user_properties';
  readonly label = 'User Properties';

  constructor(private readonly currentUser: CurrentUser) {}

  getElementsFor(_graph: BlueprintGraph, _targetNodeId: string): DataElementGroup[] {
    const u = this.currentUser;
    return [
      {
        sourceId: this.id,
        groupId: 'current_user',
        groupLabel: `Current User (${u.email})`,
        elements: [
          { path: 'user.id', label: 'User ID', type: 'string', sourceId: this.id },
          { path: 'user.email', label: 'Email', type: 'string', sourceId: this.id },
          { path: 'user.full_name', label: 'Full Name', type: 'string', sourceId: this.id },
          { path: 'user.role', label: 'Role', type: 'string', sourceId: this.id },
        ],
      },
    ];
  }

  formatLabel(mapping: PrefillMapping): string {
   
    const key = mapping.sourcePath.replace(/^user\./, '');
    return `Current User / ${key}`;
  }
}
