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
    this._vertices = [vertexA, vertexB];
}

/**
 * @return {Vertex[]}
 */
Edge.prototype.getVertices = function () {
    return this._vertices;
};

/**
 * @param {Vertex} vertex
 * @return {boolean}
 */
Edge.prototype.containsVertex = function (vertex) {
    return this._vertices.indexOf(vertex) !== -1;
};

/**
 * @param {Vertex} vertex
 * @return {Vertex}
 */
Edge.prototype.getIncidentVertexTo = function (vertex) {
    switch (vertex) {
        case this._vertices[0]: return this._vertices[1];
        case this._vertices[1]: return this._vertices[0];
        default: throw new Error('Invalid vertex: ' + vertex);
    }
};
