"use strict";

const DirectedEdge = require('./DirectedEdge');

class GraphConverter {
    /**
     * @param {Graph} graph
     * @return {Array}
     */
    toAdjacencyMatrix(graph) {
        var vertices = graph.getVerticesList();

        return vertices.map(function (vertex) {
            return vertices.map(function (vertexInRow) {
                return vertex.getIncidentVertices().filter(function (vertex) {
                    return vertex === vertexInRow;
                }).length;
            });
        })
    }

    /**
     * @param {Graph} graph
     * @return {Array}
     */
    toIncidenceMatrix(graph) {
        const edges = graph.getEdgesList();
        const vertices = graph.getVerticesList();
        const incidenceMatrix = createEmpty2dArray(vertices.length, edges.length);
        const FROM_VERTEX = -1;
        const TO_VERTEX = 1;

        let columnCounter = 0;
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const fromIndex = vertices.indexOf(edge.getVertices()[0]);
            const toIndex = vertices.indexOf(edge.getVertices()[1]);
            const fromValue = (edge instanceof DirectedEdge) ? FROM_VERTEX : TO_VERTEX;
            const toValue = TO_VERTEX;
            incidenceMatrix[fromIndex][columnCounter] = fromValue;
            incidenceMatrix[toIndex][columnCounter++] = toValue;
        }

        return incidenceMatrix;
    };
}

/**
 * @param {number} rows
 * @param {number} rowLength
 * @return {Array}
 */
function createEmpty2dArray(rows, rowLength) {
    const arr = new Array(rows);
    for(let i = 0; i < arr.length; i++){
        arr[i] = (new Array(rowLength)).fill(0);
    }
    return arr;
}

module.exports = GraphConverter;
