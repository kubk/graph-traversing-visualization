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
 * @return {Vertex}
 */
UndirectedEdge.prototype.getIncidentVertexTo = function (vertex) {
    switch (vertex) {
        case this._vertexA: return this._vertexB;
        case this._vertexB: return this._vertexA;
        default: throw new Error('Invalid vertex: ' + vertex);
    }
};