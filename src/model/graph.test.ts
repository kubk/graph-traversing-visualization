import { Graph } from './graph';
import { UndirectedEdge } from './undirected-edge';
import { Vertex } from './vertex';
import { DirectedEdge } from './directed-edge';

describe('Graph', () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph();
  });

  it('contains added vertex', () => {
    const vertex = graph.createVertexWithPosition();
    expect(graph.containsVertex(vertex)).toBeTruthy();
  });

  it('calls attached listeners', () => {
    const vertexCreated = jest.fn();
    graph.on('vertexCreated', vertexCreated);
    const vertex = graph.createVertexWithPosition();
    expect(vertexCreated).toBeCalledTimes(1);

    const vertexDeleted = jest.fn();
    graph.on('vertexDeleted', vertexDeleted);
    graph.deleteVertex(vertex);
    expect(vertexDeleted).toBeCalledTimes(1);

    const edgeAdded = jest.fn();
    graph.on('edgeAdded', edgeAdded);
    graph.addEdge(new UndirectedEdge(new Vertex('1'), new Vertex('2')));
    expect(edgeAdded).toBeCalledTimes(1);
  });

  it('deletes vertex', () => {
    const vertex = graph.createVertexWithPosition();
    expect(graph.containsVertex(vertex)).toBeTruthy();
    graph.deleteVertex(vertex);
    expect(graph.containsVertex(vertex)).toBeFalsy();
  });

  it('gives unique names for vertices', () => {
    const vertex1 = graph.createVertexWithPosition();
    const vertex2 = graph.createVertexWithPosition();
    const vertex3 = graph.createVertexWithPosition();

    expect(vertex1.id).not.toEqual(vertex2.id);
    expect(vertex2.id).not.toEqual(vertex3.id);
    expect(vertex3.id).not.toEqual(vertex1.id);
  });

  it('allows to use custom name generators', () => {
    const getGenerator = () => {
      let counter = 1;
      return () => counter++;
    };

    graph = new Graph(getGenerator());

    const vertex1 = graph.createVertexWithPosition();
    const vertex2 = graph.createVertexWithPosition();
    const vertex3 = graph.createVertexWithPosition();

    expect(1).toBe(vertex1.id);
    expect(2).toBe(vertex2.id);
    expect(3).toBe(vertex3.id);
  });

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
    graph.addEdge(new DirectedEdge(v1, v2));
    graph.addEdge(new UndirectedEdge(v5, v2));
    graph.addEdge(new DirectedEdge(v2, v3));
    graph.addEdge(new DirectedEdge(v4, v3));
    graph.addEdge(new UndirectedEdge(v1, v2));

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
