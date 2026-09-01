import type { Graph, NodeId } from '../types.js';
import { Dependency } from '../types.js';
import { extractDependencies } from './extractor.js';

/**
 * Construit le graphe (nœuds numérotés + listes d'adjacence)
 * à partir de la liste des arêtes.
 */


const deps = await extractDependencies('src');
const graph = buildGraph(deps);


export function buildGraph(dependencies: Dependency[]): Graph {
    const nodes: string[] = [];
    const index: Map<string, NodeId> = new Map();
    const adj: NodeId[][] = [];
    const reverseAdj: NodeId[][] = [];
    


    function getNodeId(path: string): NodeId{
        const existing = index.get(path);
        if(existing !== undefined){
            return existing;
        }

        const id = nodes.length;
        nodes.push(path);
        index.set(path, id);
        adj.push([]);
        reverseAdj.push([]);
        return id;
    

     }

     for(const dep of dependencies){
        const fromId = getNodeId(dep.from);
        const toId = getNodeId(dep.to);
      if (!adj[fromId].includes(toId)) {
            adj[fromId].push(toId);
            reverseAdj[toId].push(fromId);
        }
     }
     
     return {nodes, index, adj, reverseAdj};


}

/**
 * 
 * console.log('NODES  :', graph.nodes);
console.log('ADJ    :', graph.adj);
console.log('REVERSE:', graph.reverseAdj);
*/
