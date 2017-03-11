"use strict";

module.exports = DirectedEdge;
var Edge = require('./Edge');

/**
 * Represents a one-way edge
 *
 * @param {Vertex} fromVertex
 * @param {Vertex} toVertex
 * @constructor
 */
function DirectedEdge(fromVertex, toVertex) {
    Edge.call(this, fromVertex, toVertex);
    this._fromVertex = fromVertex;
    this._toVertex = toVertex;
    fromVertex.addEdge(this);
    toVertex.addEdge(this);
}

DirectedEdge.prototype = Object.create(Edge.prototype);

/**
 * @return {Vertex}
 */
DirectedEdge.prototype.getFromVertex = function () {
    return this._fromVertex;
};

/**
 * @param {Vertex} vertex
 * @return {Vertex}
 */
DirectedEdge.prototype.getIncidentVertexTo = function (vertex) {
    switch (vertex) {
        case this._fromVertex: return this._toVertex;
        case this._toVertex: return this._fromVertex;
        default: throw new Error('Invalid vertex: ' + vertex)
    }
};