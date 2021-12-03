import { Graph } from '../src/model/graph';
import { UndirectedEdge } from '../src/model/undirected-edge';
import { Vertex } from '../src/model/vertex';

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
    graph.on(Graph.EVENT_VERTEX_CREATED, vertexCreated);
    const vertex = graph.createVertexWithPosition();
    expect(vertexCreated).toBeCalledTimes(1);

    const vertexDeleted = jest.fn();
    graph.on(Graph.EVENT_VERTEX_DELETED, vertexDeleted);
    graph.deleteVertex(vertex);
    expect(vertexDeleted).toBeCalledTimes(1);

    const edgeAdded = jest.fn();
    graph.on(Graph.EVENT_EDGE_ADDED, edgeAdded);
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

    expect(vertex1.getId()).not.toEqual(vertex2.getId());
    expect(vertex2.getId()).not.toEqual(vertex3.getId());
    expect(vertex3.getId()).not.toEqual(vertex1.getId());
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

    expect(1).toBe(vertex1.getId());
    expect(2).toBe(vertex2.getId());
    expect(3).toBe(vertex3.getId());
  });
});
