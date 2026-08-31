export interface ScanOptions{
 extensions?: string[]; 
 ignore?: string[];
}

export interface Dependency {
    from: string;
    to: string;
}
export type NodeId = number;
export interface Graph {
    nodes: string[];             
    index: Map<string, NodeId>;  
    adj: NodeId[][];              
    reverseAdj: NodeId[][];       
}