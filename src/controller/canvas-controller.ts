import { Graph } from '../model/graph';
import { CanvasRenderer } from '../view/canvas-renderer';
import { Vertex } from '../model/vertex';
import { Position } from '../model/position';
import { groupEdgesByVertices } from '../view/group-edges-by-vertices';
import { DirectedEdge } from '../model/directed-edge';
import { UndirectedEdge } from '../model/undirected-edge';
const debounce = require('lodash/debounce');

export class CanvasController {
  private dragVertex: Vertex | null = null;
  private selectedVertex: Vertex | null = null;
  private uncompletedEdge: Position | null = null;
  private selectedVertexColor = '#0f0';
  private vertexRadius = 20;

  constructor(
    private graph: Graph,
    private canvas: HTMLCanvasElement,
    private canvasRenderer: CanvasRenderer
  ) {
    this.canvas.addEventListener('click', this.onClickListener.bind(this));
    this.canvas.addEventListener('contextmenu', this.onContextMenuListener.bind(this));
    this.canvas.addEventListener('mousemove', this.onMousemoveListener.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseupListener.bind(this));
    this.canvas.addEventListener('mousedown', this.onMousedownListener.bind(this));
    window.addEventListener('resize', debounce(this.onResizeListener.bind(this), 100));
    this.graph.on('vertexCreated', this.drawVertex.bind(this));
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
      return position.isInCircle(vertex.getPosition()!, this.vertexRadius);
    });
  }

  redraw(): void {
    this.canvasRenderer.clearCanvas();
    const groupedEdges = groupEdgesByVertices(this.graph.getEdgesList());
    groupedEdges.forEach(edges => this.canvasRenderer.drawEdges(edges));

    this.graph.getVerticesList().forEach(vertex => {
      const color = vertex === this.selectedVertex ? this.selectedVertexColor : undefined;
      this.canvasRenderer.drawCircle(
        vertex.getPosition()!,
        this.vertexRadius,
        vertex.id.toString(),
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

  private onResizeListener(): void {
    this.canvasRenderer.recalculateDimensions();
    this.redraw();
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
          this.graph.addEdge(new DirectedEdge(vertexFrom, vertex));
        } else {
          this.graph.addEdge(new UndirectedEdge(vertexFrom, vertex));
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
        this.canvasRenderer.drawDirectedLine(this.uncompletedEdge, mousePosition);
      } else {
        this.canvasRenderer.drawUndirectedLine(this.uncompletedEdge, mousePosition);
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

  onMousedownListener(event: MouseEvent): void {
    const vertex = this.getVertexByPosition(this.getEventPosition(event));
    if (!vertex) {
      return;
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
    this.canvasRenderer.drawCircle(
      vertex.getPosition()!,
      this.vertexRadius,
      vertex.id.toString()
    );
  }
}

function ctrlKeyIsPressed(event: MouseEvent): boolean {
  return event.ctrlKey || event.metaKey;
}
