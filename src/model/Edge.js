"use strict";

module.exports = Edge;
var Vertex = require('./Vertex');

/**
 * Abstract edge
 * 
 * @param {Vertex} vertexA
 * @param {Vertex} vertexB
 * @constructor
 */
function Edge(vertexA, vertexB) {
    if (![vertexA, vertexB].every(function (v) { return v instanceof Vertex; })) {
        throw new TypeError('Vertices must be of type Vertex');
    }
    this._vertices = [vertexA, vertexB];
}

/**
 * @returns {Vertex[]}
 */
Edge.prototype.getVertices = function () {
    return this._vertices;
};

/**
 * @param {Vertex} vertex
 * @returns {boolean}
 */
Edge.prototype.containsVertex = function (vertex) {
    return this._vertices.indexOf(vertex) !== -1;
};

Edge.prototype.getIncidentVertexTo = function () {
    throw new Error('Method declared as abstract and must be overridden');
};