import {Graph, NodeId} from '../types.js';

/**
 * Algorithme de Tarjan : trouve les composantes fortement connexes (SCC).
 * Chaque SCC de taille > 1 correspond à un cycle d'imports.
 */

export function findSCCs(graph: Graph) : NodeId[][]{
    const n = graph.nodes.length;

    // les deux numeros low et disc 
    const disc : number[] = new Array(n).fill(-1); // -1 n'est pas encore visité 
    const low : number[] = new Array(n).fill(-1);

    // la pile des noeuds "en cours d'exploration"
    const stack : NodeId[] = [];
    const onStack : boolean[] = new Array(n).fill(false);

    //le compteur de numérotation (visite)
    let time =0;


    // le resultat cest la liste des SCCs 
    const sccs : NodeId[][] = [];

function strongConnect(u: NodeId): void{
    // on decouvre u : on lui pose sn disc et low
     disc[u] = time;
     low[u] = time;
     time ++;

     // on empile u
        stack.push(u);
        onStack[u] = true;

    // on regarde les voisisns de u 
    for(const v of graph.adj[u]){
        if(disc[v] === -1){
            // v jamais visité 
            strongConnect(v);
            low[u] = Math.min(low[u], low[v]);

        }else{
            // v est deja visité et sur la pile 
            low[u] = Math.min(low[u], disc[v]);
        }
    }
// si un est une tete 
    if ( low[u] ==  disc[u]){
const scc : NodeId[] = [];
let w : NodeId;
do{
    w = stack.pop()!;
    onStack[w] = false;
    scc.push(w);
}while(w !== u);
sccs.push(scc);

    }
}

for (let u =0; u<n ; u++){
    if(disc[u] === -1){
        strongConnect(u);
    }
}


    return sccs;

}

