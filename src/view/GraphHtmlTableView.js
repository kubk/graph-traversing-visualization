"use strict";

module.exports = GraphHtmlTableView;
var Graph = require('./../model/Graph');
var DirectedEdge = require('./../model/DirectedEdge');

/**
 * @param {Graph} graph
 * @param {GraphConverter} graphConverter
 * @constructor
 */
function GraphHtmlTableView(graph, graphConverter) {
    this._graph = graph;
    this._gc = graphConverter;
    this._setUpEventListeners();
}

/**
 * @private
 */
GraphHtmlTableView.prototype._setUpEventListeners = function () {
    this._graph.on(Graph.EVENT_VERTEX_CREATED,
        this.rebuildAdjacencyListAction.bind(this),
        this.rebuildAdjacencyMatrixAction.bind(this),
        this.rebuildDegreesTable.bind(this)
    );
    this._graph.on(Graph.EVENT_EDGE_ADDED,
        this.rebuildIncidenceMatrixAction.bind(this),
        this.rebuildAdjacencyListAction.bind(this),
        this.rebuildAdjacencyMatrixAction.bind(this),
        this.rebuildDegreesTable.bind(this)
    );
    this._graph.on(Graph.EVENT_VERTEX_DELETED,
        this.rebuildAdjacencyListAction.bind(this),
        this.rebuildAdjacencyMatrixAction.bind(this),
        this.rebuildIncidenceMatrixAction.bind(this),
        this.rebuildDegreesTable.bind(this)
    );
};

GraphHtmlTableView.prototype.rebuildIncidenceMatrixAction = function () {
    var incidenceMatrix = this._gc.edgesListToIncidenceMatrix(this._graph.getEdgesList(), this._graph.getVerticesList());
    document.getElementById('incidence-matrix-representation')
        .innerHTML = this._incidenceMatrixToHtmlTable(incidenceMatrix);
};

GraphHtmlTableView.prototype.rebuildAdjacencyMatrixAction = function () {
    var adjacencyMatrix = this._gc.verticesListToAdjacencyMatrix(this._graph.getVerticesList());
    document.getElementById('adjacency-matrix-representation')
        .innerHTML = this._adjacencyMatrixToHtmlTable(adjacencyMatrix, this._graph.getVerticesList());
};

GraphHtmlTableView.prototype.rebuildAdjacencyListAction = function () {
    document.getElementById('adjacency-list-representation')
        .innerHTML = this._buildAdjacencyListHtml(this._graph.getVerticesList());
};

GraphHtmlTableView.prototype.rebuildDegreesTable = function () {
    document.getElementById('degrees-representation')
        .innerHTML = this._buildDegreesTable(this._graph);
};

/**
 * @param {Vertex[]} verticesList
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._buildAdjacencyListHtml = function (verticesList) {
    if (!verticesList.length) {
        return '';
    }
    var separator = ', ',
        resultHtml = "<table><tr><th>Vertex</th><th>Adjacent vertices</th></tr>";
    verticesList.forEach(function (vertex) {
        resultHtml += "<tr><td>"
            + vertex.getId()
            + "</td><td>"
            + vertex.getIncidentVertices().map(function (vertex) {
                return vertex.getId();
            }).join(separator)
            + "</td></tr>";
    });
    return resultHtml + "</table>";
};


/**
 * @param {Array} adjacencyMatrix
 * @param {Array<Vertex>} verticesList
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._adjacencyMatrixToHtmlTable = function (adjacencyMatrix, verticesList) {
    if (!verticesList.length) {
        return '';
    }
    var resultHtml = "<table><tr><th></th>";
    resultHtml += verticesList.map(function (vertex) {
        return "<th>" + vertex.getId() + "</th>";
    }).join('');
    resultHtml += "</tr>";
    var i = 0;
    resultHtml += verticesList.map(function (vertex) {
        return "<tr><td>" + vertex.getId() + "</td>"
            + adjacencyMatrix[i++].map(function (field) {
                return "<td>" + field + "</td>";
            }).join('')
            + "</tr>";
    }).join('');
    return resultHtml + "</table>";
};

/**
 * @param {Array} incidenceMatrix
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._incidenceMatrixToHtmlTable = function (incidenceMatrix) {
    if (!incidenceMatrix.length || incidenceMatrix.every(function (row) {
            return row.length === 0
        })) {
        return '';
    }
    var resultHtml = "<table><tr><th colspan='100%'>Incidence Matrix</th></tr>";
    resultHtml += incidenceMatrix.map(function (row) {
        return "<tr>" + row.map(function (el) {
                return "<td>" + el + "</td>";
            }).join('') + "</tr>";
    }).join('');
    return resultHtml + "</table>";
};

/**
 * @param {Graph} graph
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._buildDegreesTable = function (graph) {
    var result = "<table><tr><th></th><th>inDegree</th><th>outDegree</th></tr>";
    graph.getVerticesList().forEach(function (vertex) {
        result += "<tr>";
        result += "<td>" + vertex.getId() + "</td>";
        result += "<td>" + vertex.getInDegree() + "</td>";
        result += "<td>" + vertex.getOutDegree() + "</td>";
        result += "</tr>";
    });
    return result + "</table>";
};