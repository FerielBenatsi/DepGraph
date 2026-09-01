import { writeFile } from 'node:fs/promises';
import type { Graph } from '../types.js';
import { computeMetrics } from '../metrics/metrics.js';

/**Construire un objet JSON-able représenant le graphe et ses métriques*/
export function toJsonGraph(graph: Graph){
    const metrics = computeMetrics(graph);
    //les noeuds, avec leurs metriques
    const nodes = graph.nodes.map((path, id) =>
    ({
        id,
        path,
        fanIn: metrics[id].fanIn,
        fanOut: metrics[id].fanOut,

    })
    );

    //les aretes : pour chaque noeud u, une arete vers chacun de ses successeurs
    const edges : {from : number; to : number}[]=[];

    for(let u = 0; u < graph.adj.length; u++){
        for(const v of graph.adj[u]){
            edges.push({ from : u, to: v});
        }
    }
    return{nodes, edges};
}

/** Écrit le graphe au format JSON dans un fichier. */
export async function exportJson(graph: Graph, outputPath: string): Promise<void> {
    const data = toJsonGraph(graph);
    const text = JSON.stringify(data, null, 2);   // convertit l'objet en texte JSON
    await writeFile(outputPath, text, 'utf-8');
}