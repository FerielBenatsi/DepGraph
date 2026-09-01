import { describe, it, expect } from 'vitest';
import { buildGraph } from '../src/graph/builder.js';
import { findOrphans } from '../src/algorithms/reachability.js';
import type { Dependency } from '../src/graph/extractor.js';

describe('findOrphans', () => {
    it('trouve les modules inaccessibles depuis le point d\'entrée', () => {
        // A → B  (C est isolé)
        const deps: Dependency[] = [
            { from: 'A', to: 'B' },
            { from: 'C', to: 'C' },   // petite astuce pour faire exister C dans le graphe
        ];
        const graph = buildGraph(deps);

        // point d'entrée = A (nœud 0)
        const entryA = graph.index.get('A')!;
        const orphans = findOrphans(graph, [entryA]);

        // C doit être orphelin ; A et B sont atteignables
        const orphanPaths = orphans.map((id) => graph.nodes[id]);
        expect(orphanPaths).toContain('C');
        expect(orphanPaths).not.toContain('A');
        expect(orphanPaths).not.toContain('B');
    });
});
