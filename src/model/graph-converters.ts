import { DirectedEdge } from './directed-edge';
import { Graph } from './graph';

export type AdjacencyMatrix = Array<Array<number>>;
export type IncidenceMatrix = Array<Array<-1 | 1 | 0>>;

export function toAdjacencyMatrix(graph: Graph): AdjacencyMatrix {
  const vertices = graph.getVerticesList();

  return vertices.map(vertex => {
    return vertices.map(vertexInRow => {
      return vertex.getAdjacentVertices().filter(vertex => vertex === vertexInRow).length;
    });
  });
}

export function toIncidenceMatrix(graph: Graph): IncidenceMatrix {
  const edges = graph.getEdgesList();
  const vertices = graph.getVerticesList();
  const incidenceMatrix: Array<Array<-1 | 1 | 0>> = create2dArray(vertices.length, edges.length, 0);
  const FROM_VERTEX = -1;
  const TO_VERTEX = 1;

  let columnCounter = 0;
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const fromIndex = vertices.indexOf(edge.getVertices()[0]);
    const toIndex = vertices.indexOf(edge.getVertices()[1]);
    const fromValue = edge instanceof DirectedEdge ? FROM_VERTEX : TO_VERTEX;
    const toValue = TO_VERTEX;
    incidenceMatrix[fromIndex][columnCounter] = fromValue;
    incidenceMatrix[toIndex][columnCounter++] = toValue;
  }

  return incidenceMatrix;
}

function create2dArray<T>(rows: number, rowLength: number, fill: T): Array<Array<T>> {
  const arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rowLength).fill(fill);
  }
  return arr;
}
