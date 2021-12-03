import { UndirectedEdge } from './undirected-edge';
import { Vertex } from './vertex';

/**
 * Represents a one-way edge
 */
export class DirectedEdge extends UndirectedEdge {
  startsWith(vertex: Vertex): boolean {
    return this.fromVertex === vertex;
  }

  endsWith(vertex: Vertex): boolean {
    return this.toVertex === vertex;
  }
}
