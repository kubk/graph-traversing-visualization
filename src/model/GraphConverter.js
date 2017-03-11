"use strict";

module.exports = GraphConverter;
var DirectedEdge = require('./DirectedEdge');

function GraphConverter() {
    /**
     * @param {Graph} graph
     * @return {Array}
     */
    this.toAdjacencyMatrix = function (graph) {
        var vertices = graph.getVerticesList();

        return vertices.map(function (vertex) {
            return vertices.map(function (vertexInRow) {
                return vertex.getIncidentVertices().filter(function (vertex) {
                    return vertex === vertexInRow;
                }).length;
            });
        });
    };

    /**
     * @param {Graph} graph
     * @return {Array}
     */
    this.toIncidenceMatrix = function (graph) {
        var edges = graph.getEdgesList();
        var vertices = graph.getVerticesList();
        var incidenceMatrix = this._createEmpty2dArray(vertices.length, edges.length);
        var FROM_VERTEX = -1;
        var TO_VERTEX = 1;

        var columnCounter = 0;
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var fromIndex = vertices.indexOf(edge.getVertices()[0]);
            var toIndex = vertices.indexOf(edge.getVertices()[1]);
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
     * @return {Array}
     * @private
     */
    this._createEmpty2dArray = function (rows, rowLength) {
        var arr = new Array(rows);
        for(var i = 0; i < arr.length; i++){
            arr[i] = (new Array(rowLength)).fill(0);
        }
        return arr;
    };
}
