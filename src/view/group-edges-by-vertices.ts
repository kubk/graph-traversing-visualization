import { UndirectedEdge } from '../model/undirected-edge';
import { Vertex } from '../model/vertex';

export function groupEdgesByVertices(edges: UndirectedEdge[]): UndirectedEdge[][] {
  const hashMap: { [key in string]: UndirectedEdge[] } = {};

  edges.forEach(edge => {
    const hash = edge
      .getVertices()
      .map((vertex: Vertex) => vertex.getId())
      .sort()
      .join('');

    if (hashMap[hash]) {
      hashMap[hash].push(edge);
    } else {
      hashMap[hash] = [edge];
    }
  });

  return Object.values(hashMap);
}
