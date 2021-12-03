import { Vertex } from './vertex';
import { UndirectedEdge } from './undirected-edge';
import { EventEmitter } from './event-emitter';
import { Position } from './position';

export class Graph extends EventEmitter {
  private readonly generateVertexId: () => number | string;

  static EVENT_VERTEX_CREATED = 'vertexCreated';
  static EVENT_VERTEX_DELETED = 'vertexDeleted';
  static EVENT_EDGE_ADDED = 'edgeAdded';

  constructor(
    generateVertexId?: () => number | string,
    private verticesList: Vertex[] = [],
    private edgesList: UndirectedEdge[] = []
  ) {
    super();
    this.generateVertexId = generateVertexId || getVertexIdGenerator();
  }

  containsVertex(vertex: Vertex): boolean {
    return this.verticesList.indexOf(vertex) !== -1;
  }

  addEdge(edge: UndirectedEdge): void {
    this.edgesList.push(edge);
    this.trigger(Graph.EVENT_EDGE_ADDED);
  }

  createVertexWithPosition(position?: Position): Vertex {
    const vertex = new Vertex(this.generateVertexId(), position);
    this.verticesList.push(vertex);
    this.trigger(Graph.EVENT_VERTEX_CREATED, vertex);
    return vertex;
  }

  getVerticesList(): Vertex[] {
    return this.verticesList;
  }

  getEdgesList(): UndirectedEdge[] {
    return this.edgesList;
  }

  deleteVertex(vertex: Vertex): void {
    const doesNotContainVertex = (edge: UndirectedEdge) => !edge.containsVertex(vertex);

    for (let i = 0; i < this.verticesList.length; i++) {
      const currentVertex = this.verticesList[i];
      currentVertex.filterEdges(doesNotContainVertex);
      if (currentVertex === vertex) {
        this.verticesList.splice(i--, 1);
        this.edgesList = this.edgesList.filter(doesNotContainVertex);
      }
    }

    this.trigger(Graph.EVENT_VERTEX_DELETED);
  }
}

function getVertexIdGenerator(): () => string {
  let current = 65;
  return () => String.fromCharCode(current++);
}
