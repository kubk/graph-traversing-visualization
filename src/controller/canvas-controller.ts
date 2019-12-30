import { Graph } from '../model/graph';
import { CanvasRenderer } from '../view/canvas-renderer';
import { Vertex } from '../model/vertex';
import { Position } from '../model/position';
import { UndirectedEdge } from '../model/undirected-edge';

export class CanvasController {
  canvasHelper = new CanvasRenderer(this.canvas);
  private dragVertex: Vertex | null = null;
  private selectedVertex: Vertex | null = null;
  private uncompletedEdge: Position | null = null;
  private readonly selectedVertexColor = '#0f0';
  private readonly vertexRadius = 20;

  constructor(private graph: Graph, private canvas: HTMLCanvasElement) {
    this.canvas.addEventListener('click', this.onClickListener.bind(this));
    this.canvas.addEventListener('contextmenu', this.onContextMenuListener.bind(this));
    this.canvas.addEventListener('mousemove', this.onMousemoveListener.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseupListener.bind(this));
    this.canvas.addEventListener('mousedown', this.onMousedownListener.bind(this));
    this.graph.on(Graph.EVENT_VERTEX_CREATED, this.drawVertex.bind(this));
  }

  setVertexAsSelected(vertex: Vertex): void {
    if (!this.graph.containsVertex(vertex)) {
      throw new Error('Attempt to select not added vertex');
    }

    this.selectedVertex = vertex;
    this.redraw();
  }

  getSelectedVertex(): Vertex | null {
    return this.selectedVertex;
  }

  discardSelectedVertex(): void {
    this.selectedVertex = null;
  }

  private getVertexByPosition(position: Position): Vertex | undefined {
    return this.graph.getVerticesList().find(vertex => {
      return checkPositionIsInCircle(position, vertex.getPosition()!, this.vertexRadius);
    });
  }

  redraw(): void {
    this.canvasHelper.clearCanvas();
    const groupedEdges = groupEdgesByVertices(this.graph.getEdgesList());
    groupedEdges.forEach(edges => this.canvasHelper.drawEdges(edges));

    this.graph.getVerticesList().forEach(vertex => {
      const color = vertex === this.selectedVertex ? this.selectedVertexColor : undefined;
      this.canvasHelper.drawCircle(
        vertex.getPosition()!,
        this.vertexRadius,
        vertex.getId().toString(),
        color
      );
    });
  }

  getVertexRadius(): number {
    return this.vertexRadius;
  }

  private onClickListener(event: MouseEvent): void {
    const clickPosition = this.getEventPosition(event);
    const vertex = this.getVertexByPosition(clickPosition);

    if (!this.dragVertex && !vertex) {
      this.graph.createVertexWithPosition(clickPosition);
    } else if (vertex && ctrlKeyIsPressed(event)) {
      this.setVertexAsSelected(vertex);
    }
  }

  private onContextMenuListener(event: MouseEvent): void {
    event.preventDefault();
    const clickPosition = this.getEventPosition(event);
    const vertex = this.getVertexByPosition(clickPosition);

    if (ctrlKeyIsPressed(event) && vertex) {
      this.graph.deleteVertex(vertex);
    } else if (vertex) {
      if (this.uncompletedEdge) {
        const vertexFrom = this.getVertexByPosition(this.uncompletedEdge)!;
        if ((document.getElementById('directed-edge') as HTMLInputElement).checked) {
          this.graph.addEdge(vertexFrom.createDirectedEdgeTo(vertex));
        } else {
          this.graph.addEdge(vertexFrom.createUndirectedEdgeTo(vertex));
        }
        this.uncompletedEdge = null;
        this.redraw();
      } else if (vertex) {
        this.uncompletedEdge = vertex.getPosition() || null;
      }
    } else if (this.uncompletedEdge && !vertex) {
      this.uncompletedEdge = null;
      this.redraw();
    }
  }

  private onMousemoveListener(event: MouseEvent): void {
    const mousePosition = this.getEventPosition(event);

    if (this.uncompletedEdge) {
      this.redraw();
      const isEdgeDirected = (document.getElementById('directed-edge') as HTMLInputElement).checked;
      if (isEdgeDirected) {
        this.canvasHelper.drawDirectedLine(this.uncompletedEdge, mousePosition);
      } else {
        this.canvasHelper.drawUndirectedLine(this.uncompletedEdge, mousePosition);
      }
    } else if (this.dragVertex) {
      this.dragVertex.setPosition(mousePosition);
      this.redraw();
    }
  }

  onMouseupListener(): void {
    if (this.dragVertex) {
      this.dragVertex = null;
      this.redraw();
    }
  }

  onMousedownListener(event: MouseEvent): any {
    const vertex = this.getVertexByPosition(this.getEventPosition(event));

    if (!vertex) {
      return false;
    }

    this.dragVertex = vertex;
  }

  private getEventPosition(event: MouseEvent): Position {
    const boundingClientRect = this.canvas.getBoundingClientRect();

    return new Position(
      parseInt((event.clientX - boundingClientRect.left).toString()),
      parseInt((event.clientY - boundingClientRect.top).toString())
    );
  }

  drawVertex(vertex: Vertex): void {
    this.canvasHelper.drawCircle(
      vertex.getPosition()!,
      this.vertexRadius,
      vertex.getId().toString()
    );
  }
}

function checkPositionIsInCircle(
  position: Position,
  circlePosition: Position,
  circleRadius: number
): boolean {
  return (
    Math.pow(position.getX() - circlePosition.getX(), 2) +
      Math.pow(position.getY() - circlePosition.getY(), 2) <=
    Math.pow(circleRadius, 2)
  );
}

function groupEdgesByVertices(edges: UndirectedEdge[]): UndirectedEdge[][] {
  const hashMap: { [key in string]: UndirectedEdge[] } = {};

  edges.forEach(function(edge) {
    const hash = edge
      .getVertices()
      .map((vertex: Vertex) => vertex.getId())
      .sort()
      .join('');

    if (hashMap[hash]) {
      hashMap[hash].push(edge);
    } else {
      hashMap[hash] = [edge];
    }
  });

  const withoutHash = [];

  for (let i in hashMap) {
    withoutHash.push(hashMap[i]);
  }

  return withoutHash;
}

function ctrlKeyIsPressed(event: MouseEvent): boolean {
  return event.ctrlKey || event.metaKey;
}
