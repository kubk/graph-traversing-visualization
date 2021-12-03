import { breadthFirstSearch, depthFirstSearch } from './traversing-algorithms';
import { UndirectedEdge } from './undirected-edge';
import { Graph } from './graph';
import { DirectedEdge } from './directed-edge';

describe('Traversing algorithms', () => {
  const graph = new Graph();
  const v1 = graph.createVertexWithPosition();
  const v2 = graph.createVertexWithPosition();
  const v3 = graph.createVertexWithPosition();
  const v4 = graph.createVertexWithPosition();
  const v5 = graph.createVertexWithPosition();
  const v6 = graph.createVertexWithPosition();
  const v7 = graph.createVertexWithPosition();

  /**
   *   4
   *  /
   * 1 <--\
   * |     |
   * \---> 2 -- 3 --> 5
   *       \
   *        6 -- 7
   */
  graph.addEdge(new DirectedEdge(v1, v2));
  graph.addEdge(new DirectedEdge(v2, v1));
  graph.addEdge(new UndirectedEdge(v4, v1));
  graph.addEdge(new UndirectedEdge(v2, v3));
  graph.addEdge(new DirectedEdge(v3, v5));
  graph.addEdge(new UndirectedEdge(v2, v6));
  graph.addEdge(new UndirectedEdge(v6, v7));

  it('bfs', () => {
    expect(breadthFirstSearch(v2)).toStrictEqual([v2, v1, v3, v6, v4, v5, v7]);
    expect(breadthFirstSearch(v3)).toStrictEqual([v3, v2, v5, v1, v6, v4, v7]);
    expect(breadthFirstSearch(v5)).toStrictEqual([v5]);
  });

  it('dfs', () => {
    expect(depthFirstSearch(v5)).toStrictEqual([v5]);
    expect(depthFirstSearch(v2)).toStrictEqual([v2, v6, v7, v3, v5, v1, v4]);
  });
});
