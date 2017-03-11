"use strict";

module.exports = GraphConverter;
var DirectedEdge = require('./DirectedEdge');

function GraphConverter() {
    /**
     * @param {Vertex[]} verticesList
     * @return {Array}
     */
    this.verticesListToAdjacencyMatrix = function (verticesList) {
        return verticesList.map(function (vertex) {
            return verticesList.map(function (vertexInRow) {
                return vertex.getIncidentVertices().filter(function (vertex) {
                    return vertex === vertexInRow;
                }).length;
            });
        });
    };

    /**
     * @param {Edge[]} edgesList
     * @param {Vertex[]} verticesList
     * @return {Array}
     */
    this.edgesListToIncidenceMatrix = function (edgesList, verticesList) {
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
     * @return {Array}
     * @private
     */
    this._createEmpty2dArray = function (rows, rowLength) {
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
}

