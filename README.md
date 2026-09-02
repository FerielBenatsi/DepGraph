# DepGraph

> Static dependency-graph analyzer for JavaScript / TypeScript.

DepGraph scans a JS/TS project, builds a **directed import graph**, and analyzes it to surface architectural problems: circular imports, tightly-coupled hub files, and modules that are unreachable from the entry points.

Built from scratch in TypeScript — the graph algorithms (Tarjan's SCC, DFS reachability, fan-in/fan-out) are hand-implemented, not delegated to a library.

---

## The problem

In any medium-to-large JS/TS codebase, the implicit graph of imports between files becomes hard to reason about. This surfaces as:

- **Circular imports** that break tree-shaking and make modules fail to initialize;
- **Tightly-coupled files** that half the project depends on, and that can't be changed safely;
- **Unreachable modules** — potential dead code nobody dares delete;
- **Hub files** — single points of fragility with a very high number of dependents.

These issues are invisible to the naked eye. DepGraph makes them measurable.

## The solution

DepGraph models the project as a directed graph — **one file = one vertex, one import `A → B` = one directed edge** — then runs graph algorithms over it to detect and explain the problems above.

## Features

- Recursively scans a project and extracts imports via a real **AST** (`@typescript-eslint/parser`), not regex — so imports inside comments or strings are correctly ignored.
- Resolves local imports to real files (handles extension inference, `index` files, and the NodeNext `.js`→`.ts` convention); external packages and `node_modules` are excluded.
- Builds a directed graph as an **adjacency list** with integer-indexed nodes.
- Detects **circular dependencies** using **Tarjan's strongly-connected-components** algorithm — `O(V + E)`.
- Flags **potentially unreachable modules** via DFS reachability from the entry points.
- Computes **fan-in / fan-out** and ranks the most critical **hub** modules.
- Prints a readable CLI report and exports the graph as **JSON**.
- Interactive **web visualization** (React + Cytoscape.js): explore the graph, hover a node to reveal its path, node size scales with fan-in.

## How it works

The engine is a one-way pipeline; each stage transforms the previous one's output:

```
project  →  Scanner  →  Parser (AST)  →  Resolver  →  Graph Builder  →  Analysis  →  Report / JSON / Web
```

| Stage         | Responsibility                                                                            |
| ------------- | ----------------------------------------------------------------------------------------- |
| Scanner       | Recursively walks the project, filters by extension, ignores `node_modules`, `dist`, etc. |
| Parser        | Parses each file to an AST and extracts its `ImportDeclaration` sources.                  |
| Resolver      | Resolves each import to a real local file, or discards it (external / unresolved).        |
| Graph Builder | Assigns an integer id to each file and builds the adjacency lists.                        |
| Analysis      | Runs Tarjan (SCC / cycles), DFS reachability (orphans), and metrics (fan-in/out, hubs).   |
| Report        | Renders the CLI report, the JSON export, and feeds the web visualization.                 |

### Algorithms

- **Tarjan's SCC** — finds all strongly-connected components in a single DFS pass. Any SCC of size > 1 is a set of mutually-dependent files, i.e. a circular import. `O(V + E)`.
- **DFS reachability** — marks every node reachable from the entry points; unmarked nodes are reported as _potentially_ unreachable.
- **Fan-in / fan-out** — in-degree and out-degree per module; outliers flag high coupling and critical hubs.

## Installation

```bash
git clone https://github.com/FerielBenatsi/depgraph.git
cd depgraph
npm install
```

## Usage

Analyze a project and print the report:

```bash
npx tsx src/cli/index.ts <path-to-project>
```

Export the graph as JSON:

```bash
npx tsx src/cli/index.ts <path-to-project> --export graph.json
```

Run the web visualization (from the `web/` folder):

```bash
cd web
npm install
npm run dev
```

## Example output

```
=====================================
          DEPGRAPH REPORT
=====================================

Project: src

Files:              13
Dependencies:       21

Circular imports:   0

Average fan-in:     1.5
Average fan-out:    1.5

Critical modules:
  src/types.ts             fan-in: 8
  src/graph/extractor.ts   fan-in: 2
  ...
=====================================
```

![DepGraph visualization](/web/public/screenshot.png)

## Limitations

DepGraph is a **static** analyzer, and it is honest about what that means:

- "Potentially unreachable" means _not reached from the provided entry points_ — not proven dead. Dynamic imports (`import()`), string-based or convention-based loading are invisible to static analysis.
- Only static `import` / `require` statements are followed.
- It analyzes a project's **internal** architecture; external dependencies are intentionally out of scope.

It is a reasoning and diagnosis tool, not a replacement for industrial tools like Madge or dependency-cruiser.

## Tests

The engine is covered by unit tests over small, controlled graphs (acyclic, simple cycle, complex cycle, multiple SCCs, unreachable module), plus scanner/parser/resolver fixtures.

```bash
npm test
```

## Tech stack

TypeScript · Node.js · `@typescript-eslint/parser` (AST) · Vitest · React · Vite · Cytoscape.js

## Future work

- **Neo4j comparison study** — persist the dependency graph in a Neo4j graph database and benchmark in-memory analysis against Cypher / GDS queries, to find the graph size at which a graph database outperforms in-memory computation.
- Optional PageRank centrality for finer hub ranking.
- TypeScript path-alias (`@/…`) resolution via `tsconfig`.
- Topological sort exposed in the CLI.

## License

MIT
