import { useState, useEffect } from 'react'

import './App.css'

interface GraphNode {
  id: number;
  path: string;
  fanIn: number;
  fanOut: number;
}

interface GraphEdge {
  from: number;
  to: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
function App() {
const [graphData, setGraphData] = useState<GraphData | null>(null);

   useEffect(() => {
    async function loadGraph(){
      const response = await fetch('/graph.json');
      const data = await response.json();
      setGraphData(data);
    }
    loadGraph();
   }, [])
  return (
  <div style={{ width: '100vw', height: '100vh', background: '#f4f0f6' }}>
      {graphData ? (
        <div>
          <h2>Données chargées ✓</h2>
          <p>Nœuds : {graphData.nodes.length}</p>
          <p>Arêtes : {graphData.edges.length}</p>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  )
}

export default App
