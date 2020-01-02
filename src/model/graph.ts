import { Vertex } from './vertex';
import { UndirectedEdge } from './undirected-edge';
import { EventEmitter } from './event-emitter';
import { Position } from './position';

function createVertexIdGenerator(): () => string {
  let current = 65;
  return () => String.fromCharCode(current++);
}

type GraphEvents = {
  vertexCreated: (vertex: Vertex) => void;
  vertexDeleted: () => void;
  edgeAdded: () => void;
};

export class Graph extends EventEmitter<GraphEvents> {
  private generateVertexId: () => number | string;

  constructor(
    generateVertexId?: () => number | string,
    private verticesList: Vertex[] = [],
    private edgesList: UndirectedEdge[] = []
  ) {
    super();
    this.generateVertexId = generateVertexId || createVertexIdGenerator();
  }

  containsVertex(vertex: Vertex): boolean {
    return this.verticesList.indexOf(vertex) !== -1;
  }

  addEdge(edge: UndirectedEdge): void {
    this.edgesList.push(edge);
    this.trigger('edgeAdded');
  }

  createVertexWithPosition(position?: Position): Vertex {
    const vertex = new Vertex(this.generateVertexId(), position);
    this.verticesList.push(vertex);
    this.trigger('vertexCreated', vertex);
    return vertex;
  }

  getVerticesList(): Vertex[] {
    return this.verticesList;
  }

  getEdgesList(): UndirectedEdge[] {
    return this.edgesList;
  }

  deleteVertex(vertex: Vertex): void {
    for (let i = 0; i < this.verticesList.length; i++) {
      const currentVertex = this.verticesList[i];
      currentVertex.removeEdges(edge => edge.containsVertex(vertex));
      if (currentVertex === vertex) {
        this.verticesList.splice(i--, 1);
        this.edgesList = this.edgesList.filter(edge => !edge.containsVertex(vertex));
      }
    }

    this.trigger('vertexDeleted');
  }
}
