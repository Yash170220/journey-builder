import type { BlueprintGraph } from '@/types/graph';
import { fixtureGraph } from './fixtureGraph';


const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TENANT_ID = import.meta.env.VITE_TENANT_ID ?? '1';
const BLUEPRINT_ID = import.meta.env.VITE_BLUEPRINT_ID ?? 'bp_456';
const USE_FIXTURE = import.meta.env.VITE_USE_FIXTURE === 'true';

export async function fetchBlueprintGraph(): Promise<BlueprintGraph> {
  if (USE_FIXTURE) return fixtureGraph;

  const url = `${API_BASE}/api/v1/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as BlueprintGraph;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[journey-builder] fetch failed (${url}); falling back to fixture.`, err);
    return fixtureGraph;
  }
}
