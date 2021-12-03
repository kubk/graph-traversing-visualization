import { Position } from './position';
import { UndirectedEdge } from './undirected-edge';
import { DirectedEdge } from './directed-edge';

/**
 * Represents a vertex: https://en.wikipedia.org/wiki/Vertex_(graph_theory)
 */
export class Vertex {
  private edges: UndirectedEdge[] = [];

  constructor(public readonly id: string | number, private position?: Position) {}

  getPosition(): Position | undefined {
    return this.position;
  }

  setPosition(position: Position): void {
    this.position = position;
  }

  removeEdges(callback: (edge: UndirectedEdge) => boolean): void {
    this.edges = this.edges.filter(edge => !callback(edge));
  }

  getEdges(): UndirectedEdge[] {
    return this.edges;
  }

  addEdge(edge: UndirectedEdge): void {
    this.edges.push(edge);
  }

  getAdjacentVertices(): Vertex[] {
    return this.edges.reduce<Vertex[]>((adjacent, edge) => {
      return edge.startsWith(this) ? adjacent.concat(edge.getIncidentVertexTo(this)) : adjacent;
    }, []);
  }

  getInDegree(): number {
    return this.edges.reduce((inDegree, edge) => {
      return edge.endsWith(this) ? inDegree + 1 : inDegree;
    }, 0);
  }

  getOutDegree(): number {
    return this.getAdjacentVertices().length;
  }
}
