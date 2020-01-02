import { Graph } from './graph';
import { DirectedEdge } from './directed-edge';
import { UndirectedEdge } from './undirected-edge';
import { toAdjacencyMatrix, toIncidenceMatrix } from './graph-converters';

describe('GraphConverter', () => {
  const graph = new Graph();
  const v1 = graph.createVertexWithPosition();
  const v2 = graph.createVertexWithPosition();
  const v3 = graph.createVertexWithPosition();
  const v4 = graph.createVertexWithPosition();

  /**
   *   4
   *  /|\
   * | | |
   *  \|/
   *   1 -> 2
   *    \-> 3
   */
  graph.addEdge(new DirectedEdge(v1, v2));
  graph.addEdge(new DirectedEdge(v1, v3));
  graph.addEdge(new UndirectedEdge(v4, v1));
  graph.addEdge(new UndirectedEdge(v4, v1));
  graph.addEdge(new UndirectedEdge(v4, v1));

  it('converts graph to adjacency matrix', () => {
    expect([
      //       1  2  3  4
      /* 1 */ [0, 1, 1, 3],
      /* 2 */ [0, 0, 0, 0],
      /* 3 */ [0, 0, 0, 0],
      /* 4 */ [3, 0, 0, 0]
    ]).toStrictEqual(toAdjacencyMatrix(graph));
  });

  it('converts graph to incidence matrix', () => {
    expect([
      /* 1 */ [-1, -1, 1, 1, 1],
      /* 2 */ [1, 0, 0, 0, 0],
      /* 3 */ [0, 1, 0, 0, 0],
      /* 4 */ [0, 0, 1, 1, 1]
    ]).toStrictEqual(toIncidenceMatrix(graph));
  });
});
