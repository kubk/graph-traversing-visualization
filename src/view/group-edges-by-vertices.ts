import { UndirectedEdge } from '../model/undirected-edge';

export function groupEdgesByVertices(edges: UndirectedEdge[]): UndirectedEdge[][] {
  const hashMap: { [key in string]: UndirectedEdge[] } = {};

  edges.forEach(edge => {
    const hash = edge
      .getVertices()
      .map(({ id }) => id)
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
