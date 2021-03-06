import { DirectedEdge } from './directed-edge';
import { Vertex } from './vertex';

describe('DirectedEdge', () => {
  const fromVertex = new Vertex('1');
  const toVertex = new Vertex('1');

  const directedEdge = new DirectedEdge(fromVertex, toVertex);

  it('starts with fromVertex, ends with toVertex', () => {
    expect(directedEdge.startsWith(fromVertex)).toBeTruthy();
    expect(directedEdge.endsWith(toVertex)).toBeTruthy();
  });

  it('returns correct adjacent vertex', () => {
    expect(fromVertex).toBe(directedEdge.getIncidentVertexTo(toVertex));
    expect(toVertex).toBe(directedEdge.getIncidentVertexTo(fromVertex));
  });

  it('throws an exception if argument for getIncidentVertexTo was not added to the edge', () => {
    expect(() => {
      // @ts-ignore
      directedEdge.getIncidentVertexTo('foo');
    }).toThrow();
  });

  it('contains added vertex', () => {
    expect(directedEdge.containsVertex(fromVertex)).toBeTruthy();
    expect(directedEdge.containsVertex(toVertex)).toBeTruthy();
  });
});
