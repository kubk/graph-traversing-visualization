import { Graph } from '../model/graph';
import { toAdjacencyMatrix, toIncidenceMatrix } from '../model/graph-converters';
import { TemplateRenderer } from '../view/template-renderer';

export class HtmlTableController {
  constructor(private graph: Graph, private templateRenderer: TemplateRenderer) {}

  setUpEventListeners(): void {
    this.graph.on(
      Graph.EVENT_VERTEX_CREATED,
      this.rebuildAdjacencyListAction.bind(this),
      this.rebuildAdjacencyMatrixAction.bind(this),
      this.rebuildDegreesTable.bind(this)
    );
    this.graph.on(
      Graph.EVENT_EDGE_ADDED,
      this.rebuildIncidenceMatrixAction.bind(this),
      this.rebuildAdjacencyListAction.bind(this),
      this.rebuildAdjacencyMatrixAction.bind(this),
      this.rebuildDegreesTable.bind(this)
    );
    this.graph.on(
      Graph.EVENT_VERTEX_DELETED,
      this.rebuildAdjacencyListAction.bind(this),
      this.rebuildAdjacencyMatrixAction.bind(this),
      this.rebuildIncidenceMatrixAction.bind(this),
      this.rebuildDegreesTable.bind(this)
    );
  }

  rebuildIncidenceMatrixAction() {
    const incidenceMatrix = toIncidenceMatrix(this.graph);
    document.getElementById(
      'incidence-matrix-representation'
    )!.innerHTML = this.templateRenderer.renderIncidenceMatrix(incidenceMatrix);
  }

  rebuildAdjacencyMatrixAction() {
    const adjacencyMatrix = toAdjacencyMatrix(this.graph);
    document.getElementById(
      'adjacency-matrix-representation'
    )!.innerHTML = this.templateRenderer.renderAdjacencyMatrix(
      adjacencyMatrix,
      this.graph.getVerticesList()
    );
  }

  rebuildAdjacencyListAction() {
    document.getElementById(
      'adjacency-list-representation'
    )!.innerHTML = this.templateRenderer.renderAdjacencyList(this.graph.getVerticesList());
  }

  rebuildDegreesTable() {
    document.getElementById(
      'degrees-representation'
    )!.innerHTML = this.templateRenderer.renderDegreesTable(this.graph.getVerticesList());
  }
}
