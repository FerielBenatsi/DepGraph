import { describe, it, expect } from 'vitest';
import { buildGraph } from '../src/graph/builder.js';
import type { Dependency } from '../src/graph/extractor.js';

describe('buildGraph', () => {
    it('numérote les nœuds et construit les listes d\'adjacence', () => {
        // Graphe contrôlé :  A → B,  A → C,  B → C
        const deps: Dependency[] = [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'B', to: 'C' },
        ];

        const graph = buildGraph(deps);

        // 3 nœuds : A=0, B=1, C=2 (ordre de première apparition)
        expect(graph.nodes).toEqual(['A', 'B', 'C']);
        expect(graph.index.get('A')).toBe(0);
        expect(graph.index.get('C')).toBe(2);

        // adjacence : A→[B,C], B→[C], C→[]
        expect(graph.adj[0]).toEqual([1, 2]);   // A → B, C
        expect(graph.adj[1]).toEqual([2]);      // B → C
        expect(graph.adj[2]).toEqual([]);       // C → rien

        // fan-in de C (nœud 2) : importé par A et B
        expect(graph.reverseAdj[2]).toEqual([0, 1]);
    });

    it('ne crée pas de doublon d\'arête', () => {
        // Deux fois la même dépendance A → B
        const deps: Dependency[] = [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'B' },
        ];

        const graph = buildGraph(deps);

        expect(graph.adj[0]).toEqual([1]);   // une seule arête, pas [1, 1]
    });
});