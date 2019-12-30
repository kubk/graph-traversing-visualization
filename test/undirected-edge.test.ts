import { UndirectedEdge } from '../src/model/undirected-edge';

describe('DirectedEdge', () => {
  const vertexA = { addEdge() {} } as any;
  const vertexB = { addEdge() {} } as any;

  const undirectedEdge = new UndirectedEdge(vertexA, vertexB);

  it('returns correct incident vertex', () => {
    expect(vertexA).toBe(undirectedEdge.getIncidentVertexTo(vertexB));
    expect(vertexB).toBe(undirectedEdge.getIncidentVertexTo(vertexA));
  });

  it('throws an exception if argument for getIncidentVertexTo was not added to the edge', () => {
    expect(() => {
      // @ts-ignore
      undirectedEdge.getIncidentVertexTo('foo');
    }).toThrow();
  });

  it('contains added vertex', () => {
    expect(undirectedEdge.containsVertex(vertexB)).toBeTruthy();
    expect(undirectedEdge.containsVertex(vertexA)).toBeTruthy();
  });
});
