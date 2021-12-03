import { Vertex } from './vertex';

/**
 * Represents a two-way edge
 */
export class UndirectedEdge {
  constructor(protected fromVertex: Vertex, protected toVertex: Vertex) {
    fromVertex.addEdge(this);
    toVertex.addEdge(this);
  }

  getVertices(): Vertex[] {
    return [this.fromVertex, this.toVertex];
  }

  containsVertex(vertex: Vertex): boolean {
    return this.getVertices().indexOf(vertex) !== -1;
  }

  getIncidentVertexTo(vertex: Vertex): Vertex {
    switch (vertex) {
      case this.fromVertex:
        return this.toVertex;
      case this.toVertex:
        return this.fromVertex;
      default:
        throw new Error('Invalid vertex: ' + vertex);
    }
  }

  startsWith(vertex: Vertex): boolean {
    return this.containsVertex(vertex);
  }

  endsWith(vertex: Vertex): boolean {
    return this.containsVertex(vertex);
  }
}
