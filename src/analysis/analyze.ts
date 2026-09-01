import { extractDependencies } from '../graph/extractor.js';
import { buildGraph } from '../graph/builder.js';
import { findSCCs } from '../algorithms/tarjan.js';
import { findHubs, computeMetrics } from '../metrics/metrics.js';
import type { Graph, NodeId, ModuleMetrics, AnalysisResult  } from '../types.js';



/** Analyse un projet de bout en bout et renvoie tous les résultats. */
export async function analyzeProject(projectPath: string): Promise<AnalysisResult> {
    const deps = await extractDependencies(projectPath);
    const graph = buildGraph(deps);

    const sccs = findSCCs(graph);
    const cycles = sccs.filter((scc) => scc.length > 1);   // seuls les cycles

    const metrics = computeMetrics(graph);
    const hubs = findHubs(graph, 5);

    // moyennes de fan-in / fan-out
    const n = metrics.length || 1;   // éviter la division par zéro
    const averageFanIn = metrics.reduce((sum, m) => sum + m.fanIn, 0) / n;
    const averageFanOut = metrics.reduce((sum, m) => sum + m.fanOut, 0) / n;

    return {
        graph,
        fileCount: graph.nodes.length,
        dependencyCount: deps.length,
        cycles,
        hubs,
        averageFanIn,
        averageFanOut,
    };
}