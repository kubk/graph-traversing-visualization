"use strict";

module.exports = UndirectedEdge;
var Edge = require('./Edge');

/**
 * Represents a two-way edge
 *
 * @param {Vertex} vertexA
 * @param {Vertex} vertexB
 * @constructor
 */
function UndirectedEdge(vertexA, vertexB) {
    Edge.call(this, vertexA, vertexB);
    this._vertexA = vertexA;
    this._vertexB = vertexB;
    vertexA.addEdge(this);
    vertexB.addEdge(this);
}

UndirectedEdge.prototype = Object.create(Edge.prototype);

/**
 * @param {Vertex} vertex
 * @returns {Vertex}
 */
UndirectedEdge.prototype.getIncidentVertexTo = function (vertex) {
    if (this._vertexA === vertex) {
        return this._vertexB;
    } else if (this._vertexB === vertex) {
        return this._vertexA;
    } else {
        throw new Error('Invalid vertex: ' + vertex.getId());
    }
};