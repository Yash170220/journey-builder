import { describe, it, expect } from 'vitest';
import { UserPropertiesDataSource } from './UserPropertiesDataSource';
import { diamondGraph } from '@/lib/__fixtures__/diamondGraph';

describe('UserPropertiesDataSource', () => {
  const source = new UserPropertiesDataSource({
    id: 'u1',
    email: 'a@b.com',
    full_name: 'Test User',
    role: 'advisor',
  });

  it('exposes a Current User group with the expected fields', () => {
    const groups = source.getElementsFor(diamondGraph, 'D');
    expect(groups).toHaveLength(1);
    expect(groups[0].groupLabel).toContain('a@b.com');
    const labels = groups[0].elements.map((e) => e.label);
    expect(labels).toEqual(['User ID', 'Email', 'Full Name', 'Role']);
  });

  it('formats chip labels by stripping the user. prefix', () => {
    const label = source.formatLabel({
      targetNodeId: 'D',
      targetFieldKey: 'email',
      sourceId: 'user_properties',
      sourcePath: 'user.email',
      label: 'fallback',
    });
    expect(label).toBe('Current User / email');
  });
});
