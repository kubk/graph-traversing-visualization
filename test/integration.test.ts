import { Graph } from '../src/model/graph';

describe('Graph with vertices', () => {
  it('deletes vertex with all connected edges', () => {
    const graph = new Graph();

    const v1 = graph.createVertexWithPosition();
    const v2 = graph.createVertexWithPosition();
    const v3 = graph.createVertexWithPosition();
    const v4 = graph.createVertexWithPosition();
    const v5 = graph.createVertexWithPosition();

    /**
     *       5
     *       |
     * 1 --> 2 --> 3 <-- 4
     * |     |
     *  \---/
     */
    v1.createDirectedEdgeTo(v2);
    v5.createUndirectedEdgeTo(v2);
    v2.createDirectedEdgeTo(v3);
    v4.createDirectedEdgeTo(v3);
    v1.createUndirectedEdgeTo(v2);

    /**
     *   5
     * 1 3 <-- 4
     */
    graph.deleteVertex(v2);
    expect(graph.containsVertex(v2)).toBeFalsy();
    expect(v1.getEdges()).toHaveLength(0);
    expect(v5.getEdges()).toHaveLength(0);
    expect(v3.getEdges()).toHaveLength(1);
    expect(v4.getEdges()).toHaveLength(1);
  });
});
