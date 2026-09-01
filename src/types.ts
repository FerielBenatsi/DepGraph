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

export interface ModuleMetrics {
    path: string;
    fanIn: number;  
    fanOut: number; 
  
}
export interface AnalysisResult {
    graph: Graph;
    fileCount: number;
    dependencyCount: number;
    cycles: NodeId[][];         // les SCC de taille > 1
    hubs: ModuleMetrics[];
    averageFanIn: number;
    averageFanOut: number;
}