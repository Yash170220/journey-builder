# Journey Builder

A small React + TypeScript app for the Avantos coding challenge. Renders a
DAG of forms and lets you configure prefill mappings between fields, with
support for direct dependencies, transitive dependencies, and global data
sources.

## Run it locally

```bash

git clone 
npm install 
npm test
npm run build
npm run dev

```


## What's in here

- **Canvas** (`src/features/canvas/`) — DAG view using `@xyflow/react`. Click
  a node to open the side panel.
- **Side panel** (`src/features/panel/`) — lists the selected form's fields.
  Each field shows either a `+ Prefill` button or a chip with the current
  mapping. Clicking the chip reopens the picker; clicking the × clears it.
- **Picker** (`src/features/picker/`) — modal with a search box and
  collapsible groups. Groups come from the prefill registry, so the picker
  itself is source-agnostic.
- **Prefill registry** (`src/prefill/`) — the extension point. Four sources
  ship by default: upstream forms (graph-aware), Action Properties,
  Client Organisation Properties, and User Properties (the current user's
  profile). See "Adding a new prefill data source" below.
- **DAG utilities** (`src/lib/dag.ts`) — predecessor map + BFS for
  direct/transitive ancestors with cycle guard.
- **Store** (`src/store/journeyStore.ts`) — Zustand: graph, selected node,
  and saved mappings keyed by `${nodeId}.${fieldKey}`.

## Adding a new prefill data source

The picker pulls its data from a registry of `DataSourceProvider`s. Adding
a new source is two steps:

**1. Implement the interface:**

```ts
// src/prefill/MyDataSource.ts
import type { DataSourceProvider } from './DataSourceProvider';

export class MyDataSource implements DataSourceProvider {
  readonly id = 'my_source';
  readonly label = 'My Source';

  getElementsFor(graph, targetNodeId) {
    return [
      {
        sourceId: this.id,
        groupId: 'main',
        groupLabel: 'My Group',
        elements: [
          { path: 'something.id', label: 'Something ID', sourceId: this.id },
        ],
      },
    ];
  }

  // optional: customise how saved mappings from this source render
  formatLabel(mapping, graph) {
    return `My: ${mapping.sourcePath}`;
  }
}
```

**2. Register it:**

```ts
// src/prefill/registry.ts
export const DEFAULT_SOURCES = [
  new UpstreamFormsDataSource(),
  new GlobalPropertiesDataSource(...),
  new MyDataSource(),   // add it here
];
```

That's it — no changes to the picker, the field row, the side panel, or
the store. There's a test in `src/prefill/registry.test.ts`
(`'lets a new source plug in without changing other code'`) that walks
through this exact flow.

## Design notes

**Why a registry of providers, not a switch statement?** The challenge calls
out future, unknown data sources as a primary requirement. A switch
statement (or an enum-keyed config object) means every new source touches
the picker; an interface means it doesn't.

**Why split direct vs. transitive?** Transitive ancestors get a
`(transitive)` suffix on their group label so users can tell at a glance
where data is coming from. The traversal lives in `dag.ts` so it's easy to
test and can be reused if anything else ever needs ancestors.

**Why presentational `FieldRow` and `PrefillPicker`?** Both take their data
and callbacks via props. `SidePanel` is the only component that talks to
the store and registry. This makes the leaf components trivial to render
in tests and easy to drop into a different host (e.g. a future inline
editor) without dragging the store with them.

**Why a fixture fallback?** Reviewers who don't have the backend running
can still see the app work. If the API call fails, we log and fall back —
the UI never just shows "Failed to load". The fixture matches the diamond
DAG from the brief screenshot (A → B → D, A → C → D) so the
direct/transitive split is visible right away.

## Tradeoffs / what I'd do next

- **Persistence.** Mappings are in memory. The store is structured so a
  `PUT /blueprints/:id/mappings` swap is local to `journeyStore`.
- **Type-aware suggestions.** Right now the picker shows every upstream
  field; it doesn't filter by compatible type. Would add an optional
  `validateMapping(sourceField, targetField)` to `DataSourceProvider`.
- **Async sources.** `getElementsFor` is sync because all current sources
  have data on hand. If a future source needed to fetch, I'd promote it
  to `Promise<DataElementGroup[]>` and add per-group spinners.
- **Mobile / responsive.** Not in scope — the brief shows a desktop tool.
