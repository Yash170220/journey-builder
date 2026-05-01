import { useEffect } from 'react';
import { useJourneyStore } from '@/store/journeyStore';
import { Canvas } from '@/features/canvas/Canvas';
import { SidePanel } from '@/features/panel/SidePanel';

export function App() {
  const loadGraph = useJourneyStore((s) => s.loadGraph);
  const loading = useJourneyStore((s) => s.loading);
  const error = useJourneyStore((s) => s.error);
  const graph = useJourneyStore((s) => s.graph);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  return (
    <div className="h-full flex flex-col">
      <header className="h-12 px-4 border-b border-border bg-panel flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-bold">
            J
          </div>
          <div className="font-medium text-zinc-100">Journey Builder</div>
          {graph && <div className="text-zinc-500 text-xs ml-2">· {graph.name}</div>}
        </div>
        <button
          onClick={loadGraph}
          className="text-xs px-2 py-1 rounded border border-border text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
        >
          Reload
        </button>
      </header>

      <div className="flex-1 flex min-h-0">
        <main className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500 z-10">
              Loading graph…
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-rose-950/40 border border-rose-900 text-rose-300 px-4 py-3 rounded max-w-md text-sm">
                <div className="font-medium mb-1">Failed to load graph</div>
                <div className="text-rose-400/80">{error}</div>
              </div>
            </div>
          )}
          <Canvas />
        </main>
        <SidePanel />
      </div>
    </div>
  );
}
