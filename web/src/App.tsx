import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

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

interface GraphDate {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function App() {
  // la div ou Cytoscape dessinera
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAndDraw() {
      const response = await fetch("/graph.json");
      const data: GraphDate = await response.json();

      const nodeElements = data.nodes.map((node) => ({
        data: {
          id: String(node.id),
          label: node.path.split(/[\\/]/).pop(),
        },
      }));

      const edgeElements = data.edges.map((edge) => ({
        data: {
          source: String(edge.from),
          target: String(edge.to),
        },
      }));
      const cy = cytoscape({
        container: containerRef.current,
        elements: [...nodeElements, ...edgeElements],
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#908c92",
              label: "",
              "font-size": "9px",
              color: "#908c92",
              "text-valign": "bottom",
              "text-margin-y": 6,
              "text-background-color": "#ffffff",
              "text-background-opacity": 0.8,
              "text-background-padding": "2px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#908c92", 
              "target-arrow-color": "#908c92",
              "target-arrow-shape": "triangle", // la flèche = sens de l'import
              "arrow-scale": 0.6,
              "curve-style": "bezier",
            },
          },
          {
            selector: "node.hover",
            style: {
              "background-color": "#e8b4c4",
              label: "data(label)", // le nom apparaît au survol
              "font-size": "11px",
              "z-index": 999,
            },
          },
        ],
        layout: {
          name: "cose",
         
          padding: 40,
        },
      });
      cy.on("mouseover", "node", (event) => {
        event.target.addClass("hover");
      });
      cy.on("mouseout", "node", (event) => {
        event.target.removeClass("hover");
      });
    }
    loadAndDraw();
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}

export default App;
