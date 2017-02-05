"use strict";

module.exports = Vertex;
var Edge = require('./Edge');
var DirectedEdge = require('./DirectedEdge');
var UndirectedEdge = require('./UndirectedEdge');
var Position = require('./Position');

/**
 * Represents a vertex: https://en.wikipedia.org/wiki/Vertex_(graph_theory)
 *
 * @param {string|number} id
 * @param {Position} [position]
 * @constructor
 */
function Vertex(id, position) {
    this._id = id;
    this._edges = [];
    this._position = (position instanceof Position) ? position : null;
}

/**
 * @returns {Position|null}
 */
Vertex.prototype.getPosition = function () {
    return this._position;
};

/**
 * @param {Position} position
 */
Vertex.prototype.setPosition = function (position) {
    if (!(position instanceof Position)) {
        throw new TypeError('Argument must be of type Position');
    }
    this._position = position;
};

/**
 * @returns {string|number}
 */
Vertex.prototype.getId = function () {
    return this._id;
};

/**
 * @param {Function} callback
 */
Vertex.prototype.filterEdges = function (callback) {
    this._edges = this._edges.filter(callback);
};

/**
 * @param {Edge} edge
 */
Vertex.prototype.addEdge = function (edge) {
    if (!(edge instanceof Edge)) {
        throw new TypeError('Argument must be of type Edge');
    }
    this._edges.push(edge);
};

/**
 * @param {Vertex} vertex
 * @returns {DirectedEdge}
 */
Vertex.prototype.createDirectedEdgeTo = function (vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }
    return new DirectedEdge(this, vertex);
};

/**
 * @param {Vertex} vertex
 * @returns {UndirectedEdge}
 */
Vertex.prototype.createUndirectedEdgeTo = function (vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }
    return new UndirectedEdge(this, vertex);
};

/**
 * @returns {Vertex[]}
 */
Vertex.prototype.getIncidentVertices = function () {
    var incidentVertices = [];
    var that = this;
    this._edges.forEach(function (edge) {
        if (edge instanceof UndirectedEdge || edge.getFromVertex() === that) {
            incidentVertices.push(edge.getIncidentVertexTo(that));
        }
    });
    return incidentVertices;
};

/**
 * @returns {number}
 */
Vertex.prototype.getInDegree = function () {
    var that = this;
    return this._edges.reduce(function (inDegree, edge) {
        return (edge instanceof UndirectedEdge || edge.getFromVertex() !== that)
            ? inDegree + 1
            : inDegree;
    }, 0);
};

/**
 * @returns {number}
 */
Vertex.prototype.getOutDegree = function () {
    var that = this;
    return this._edges.reduce(function (outDegree, edge) {
        return (edge instanceof UndirectedEdge || edge.getFromVertex() === that)
            ? outDegree + 1
            : outDegree;
    }, 0);
};