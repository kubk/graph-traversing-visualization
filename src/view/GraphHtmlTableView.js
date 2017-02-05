"use strict";

module.exports = GraphHtmlTableView;
var Graph = require('./../model/Graph');
var DirectedEdge = require('./../model/DirectedEdge');

/**
 * @param {Graph} graph
 * @param {boolean} [isStatic]
 * @constructor
 */
function GraphHtmlTableView(graph, isStatic) {
    if (!(graph instanceof Graph)) {
        throw new TypeError('Argument must be of type Graph');
    }
    this._graph = graph;
    if (!isStatic) {
        this.setUpEventListeners();
    }
}

GraphHtmlTableView.prototype.setUpEventListeners = function () {
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
    var incidenceMatrix = this._edgesListToIncidenceMatrix(this._graph.getEdgesList(), this._graph.getVerticesList());
    document.getElementById('incidence-matrix-representation')
        .innerHTML = this._incidenceMatrixToHtmlTable(incidenceMatrix);
};

GraphHtmlTableView.prototype.rebuildAdjacencyMatrixAction = function () {
    var adjacencyMatrix = this._verticesListToAdjacencyMatrix(this._graph.getVerticesList());
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
 * @returns {string}
 */
GraphHtmlTableView.prototype._buildAdjacencyListHtml = function (verticesList) {
    if (!verticesList.length) {
        return '';
    }
    var arrow = "&rarr;",
        resultHtml = "<table><tr><th>Vertex</th><th>Adjacent vertices</th></tr>";
    verticesList.forEach(function (vertex) {
        resultHtml += "<tr><td>"
            + vertex.getId()
            + "</td><td>"
            + vertex.getIncidentVertices().map(function (vertex) {
                return vertex.getId();
            }).join(arrow)
            + "</td></tr>";
    });
    return resultHtml + "</table>";
};

/**
 * @param {Vertex[]} verticesList
 * @returns {Array}
 */
GraphHtmlTableView.prototype._verticesListToAdjacencyMatrix = function (verticesList) {
    return verticesList.map(function (vertex) {
        return verticesList.map(function (vertexInRow) {
            return vertex.getIncidentVertices().filter(function (vertex) {
                return vertex === vertexInRow;
            }).length;
        });
    });
};

/**
 * @param {Array} adjacencyMatrix
 * @param {Vertex} verticesList
 * @returns {string}
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
 * @param {Edge[]} edgesList
 * @param {Vertex[]} verticesList
 * @returns {Array}
 */
GraphHtmlTableView.prototype._edgesListToIncidenceMatrix = function (edgesList, verticesList) {
    var incidenceMatrix = this._createEmpty2dArray(verticesList.length, edgesList.length);
    var FROM_VERTEX = -1;
    var TO_VERTEX = 1;

    var columnCounter = 0;
    for (var i = 0; i < edgesList.length; i++) {
        var edge = edgesList[i];
        var fromIndex = verticesList.indexOf(edge.getVertices()[0]);
        var toIndex = verticesList.indexOf(edge.getVertices()[1]);
        var fromValue = (edge instanceof DirectedEdge) ? FROM_VERTEX : TO_VERTEX;
        var toValue = TO_VERTEX;
        incidenceMatrix[fromIndex][columnCounter] = fromValue;
        incidenceMatrix[toIndex][columnCounter++] = toValue;
    }
    return incidenceMatrix;
};

/**
 * @param {number} rows
 * @param {number} rowLength
 * @returns {Array}
 */
GraphHtmlTableView.prototype._createEmpty2dArray = function (rows, rowLength) {
    var array = [];
    var fillWith = 0;
    for (var i = 0; i < rows; i++) {
        array[i] = [];
        for (var j = 0; j < rowLength; j++) {
            array[i].push(fillWith);
        }
    }
    return array;
};

/**
 * @param {Array} incidenceMatrix
 * @returns {string}
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
 * @returns {string}
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