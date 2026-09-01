import {Graph, NodeId} from '../types.js';

/**
 * À partir des points d'entrée, renvoie l'ensemble des nœuds atteignables
 * en suivant les arêtes du graphe (parcours DFS).
 */

/**
 * set : comme un tableau sans doublons et avec un test d'appartenance rapide 
*/

export function findReachableNodes(graph: Graph, entryPoints: NodeId[]): Set<NodeId> {
    const visited = new Set<NodeId>();

    function visit(u: NodeId): void{
        if(visited.has(u)) return; 
        visited.add(u);

        for(const v of graph.adj[u]){
            visit(v);
        }       
    }

    for(const u of entryPoints){
        visit(u);
    }

    return visited;
}

/**
 * Renvoie les nœuds potentiellement inaccessibles depuis les points d'entrée.
 */

export function findOrphans(graph: Graph, entryPoints: NodeId[]) :NodeId[]  {
    const reachable = findReachableNodes(graph, entryPoints);
    const orphans : NodeId[] = [];

    for(let u = 0; u < graph.nodes.length; u++){
        if(!reachable.has(u)){
            orphans.push(u);
        }
    }

    return orphans; 
}