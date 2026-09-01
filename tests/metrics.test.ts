import { describe, it, expect } from 'vitest';
import { buildGraph } from '../src/graph/builder.js';
import { computeMetrics, findHubs } from '../src/metrics/metrics.js';
import type { Dependency } from '../src/graph/extractor.js';

describe('computeMetrics', () => {
    it('calcule le fan-in et le fan-out', () => {
        // A→B, A→C, B→C
        const deps: Dependency[] = [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'B', to: 'C' },
        ];
        const graph = buildGraph(deps);
        const metrics = computeMetrics(graph);

        const A = metrics.find((m) => m.path === 'A')!;
        const C = metrics.find((m) => m.path === 'C')!;

        expect(A.fanOut).toBe(2);   // A importe B et C
        expect(A.fanIn).toBe(0);    // personne n'importe A
        expect(C.fanIn).toBe(2);    // A et B importent C
        expect(C.fanOut).toBe(0);   // C n'importe rien
    });
});

describe('findHubs', () => {
    it('classe les modules par fan-in décroissant', () => {
        const deps: Dependency[] = [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'B', to: 'C' },
        ];
        const graph = buildGraph(deps);
        const hubs = findHubs(graph, 1);

        // le hub n°1 doit être C (fan-in le plus élevé)
        expect(hubs[0].path).toBe('C');
        expect(hubs[0].fanIn).toBe(2);
    });
});