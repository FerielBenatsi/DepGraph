import { Graph, NodeId, ModuleMetrics } from "../types.js";
/**
 * Calcule le fan-in et le fan-out de chaque module du graphe.
 */

export function computeMetrics(graph: Graph): ModuleMetrics[] {
  const metrics: ModuleMetrics[] = [];
  for (let u = 0; u < graph.nodes.length; u++) {
    metrics.push({
      path: graph.nodes[u],
      fanIn: graph.reverseAdj[u].length, //le nombre de prédécesseurs = fan-in.
      fanOut: graph.adj[u].length, //le nombre de successeurs = fan-out.
    });
  }
  return metrics;
}

/**
 * Renvoie les N modules au plus fort fan-in (les "hubs" critiques).
 */

export function findHubs(graph: Graph, topN: number = 5): ModuleMetrics[] {
  const metrics = computeMetrics(graph);
  return metrics.sort((a, b) => b.fanIn - a.fanIn).slice(0, topN);
}
