import { Vertex } from './vertex';
import { UndirectedEdge } from './undirected-edge';
import { DirectedEdge } from './directed-edge';

describe('Vertex', () => {
  it('can filter edges in-place', () => {
    const vertex = new Vertex('1');
    const v1 = new Vertex('1');
    const v2 = new Vertex('2');
    const v3 = new Vertex('3');
    vertex.addEdge(new UndirectedEdge(v1, v2));
    vertex.addEdge(new UndirectedEdge(v1, v2));
    vertex.addEdge(new UndirectedEdge(v3, v2));

    vertex.removeEdges(edge => !edge.startsWith(v3));

    expect(vertex.getEdges()).toHaveLength(1);
  });

  describe('with edges', () => {
    const v1 = new Vertex(1);
    const v2 = new Vertex(2);
    const v3 = new Vertex(3);
    const v4 = new Vertex(4);

    /**
     * 4
     * |
     * 1 -> 2
     *  \-> 3
     */
    new DirectedEdge(v1, v2);
    new DirectedEdge(v1, v3);
    new UndirectedEdge(v4, v1);

    it('calculates in-degree and out-degree', () => {
      expect(v1.getOutDegree()).toBe(3);
      expect(v1.getInDegree()).toBe(1);

      expect(v4.getOutDegree()).toBe(1);
      expect(v4.getInDegree()).toBe(1);

      expect(v2.getOutDegree()).toBe(0);
      expect(v2.getOutDegree()).toBe(0);

      expect(v3.getInDegree()).toBe(1);
      expect(v3.getInDegree()).toBe(1);
    });

    it('calculates incident vertices', () => {
      expect(v4.getAdjacentVertices()).toHaveLength(1);
      expect(v4.getAdjacentVertices()[0]).toBe(v1);

      expect(v1.getAdjacentVertices()).toHaveLength(3);
      expect(v1.getAdjacentVertices().find(v => v === v4)).toBeTruthy();
      expect(v1.getAdjacentVertices().find(v => v === v3)).toBeTruthy();
      expect(v1.getAdjacentVertices().find(v => v === v2)).toBeTruthy();

      expect(v2.getAdjacentVertices()).toHaveLength(0);
      expect(v3.getAdjacentVertices()).toHaveLength(0);
    });
  });
});
