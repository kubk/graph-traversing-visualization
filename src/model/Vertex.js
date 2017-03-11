"use strict";

module.exports = Vertex;
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
    this._position = position;
};

/**
 * @return {string|number}
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
 * @return {Array<Edge>}
 */
Vertex.prototype.getEdges = function () {
    return this._edges;
};

/**
 * @param {Edge} edge
 */
Vertex.prototype.addEdge = function (edge) {
    this._edges.push(edge);
};

/**
 * @param {Vertex} vertex
 * @return {DirectedEdge}
 */
Vertex.prototype.createDirectedEdgeTo = function (vertex) {
    return new DirectedEdge(this, vertex);
};

/**
 * @param {Vertex} vertex
 * @return {UndirectedEdge}
 */
Vertex.prototype.createUndirectedEdgeTo = function (vertex) {
    return new UndirectedEdge(this, vertex);
};

/**
 * @return {Vertex[]}
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
 * @return {number}
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
 * @return {number}
 */
Vertex.prototype.getOutDegree = function () {
    var that = this;
    return this._edges.reduce(function (outDegree, edge) {
        return (edge instanceof UndirectedEdge || edge.getFromVertex() === that)
            ? outDegree + 1
            : outDegree;
    }, 0);
};