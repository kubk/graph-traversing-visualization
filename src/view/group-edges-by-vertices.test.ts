import { Graph } from '../model/graph';
import { groupEdgesByVertices } from './group-edges-by-vertices';
import { DirectedEdge } from '../model/directed-edge';
import { UndirectedEdge } from '../model/undirected-edge';

describe('group-edges-by-vertices', () => {
  it('should group edges by vertices', () => {
    const graph = new Graph();

    const v1 = graph.createVertexWithPosition();
    const v2 = graph.createVertexWithPosition();
    const v3 = graph.createVertexWithPosition();
    const v4 = graph.createVertexWithPosition();

    /**
     * 1 --> 2 --> 3 <-- 4
     * |     |     |     |
     *  \---/       \___/
     */
    graph.addEdge(new DirectedEdge(v1, v2));
    graph.addEdge(new DirectedEdge(v2, v3));
    graph.addEdge(new DirectedEdge(v4, v3));
    graph.addEdge(new UndirectedEdge(v4, v3));
    graph.addEdge(new UndirectedEdge(v1, v2));

    const groupedEdges = groupEdgesByVertices(graph.getEdgesList());

    expect(groupedEdges).toHaveLength(3);
    expect(groupedEdges[0]).toHaveLength(2);
    expect(groupedEdges[1]).toHaveLength(1);
    expect(groupedEdges[2]).toHaveLength(2);
  });
});
