"use strict";

const DirectedEdge = require('./DirectedEdge');
const UndirectedEdge = require('./UndirectedEdge');
const Position = require('./Position');

/**
 * Represents a vertex: https://en.wikipedia.org/wiki/Vertex_(graph_theory)
 */
class Vertex {
    /**
     * @param {string|number} id
     * @param {Position} position
     */
    constructor(id, position) {
        this.id = id;
        this.edges = [];
        this.position = (position instanceof Position) ? position : null;
    }

    /**
     * @returns {Position|null}
     */
    getPosition() {
        return this.position;
    }

    /**
     * @param {Position} position
     */
    setPosition(position) {
        this.position = position;
    }

    /**
     * @return {string|number}
     */
    getId() {
        return this.id;
    }

    /**
     * @param {Function} callback
     */
    filterEdges(callback) {
        this.edges = this.edges.filter(callback);
    }

    /**
     * @return {UndirectedEdge[]}
     */
    getEdges() {
        return this.edges;
    }

    /**
     * @param {UndirectedEdge} edge
     */
    addEdge(edge) {
        this.edges.push(edge);
    }

    /**
     * @param {Vertex} vertex
     * @return {DirectedEdge}
     */
    createDirectedEdgeTo(vertex) {
        return new DirectedEdge(this, vertex);
    }

    /**
     * @param {Vertex} vertex
     * @return {UndirectedEdge}
     */
    createUndirectedEdgeTo(vertex) {
        return new UndirectedEdge(this, vertex);
    }

    /**
     * @return {Vertex[]}
     */
    getIncidentVertices() {
        return this.edges.reduce((incidentVertices, edge) => {
            if (!(edge instanceof DirectedEdge) || edge.getFromVertex() === this) {
                return incidentVertices.concat(edge.getIncidentVertexTo(this));
            }
            return incidentVertices;
        }, []);
    }

    /**
     * @return {number}
     */
    getInDegree() {
        return this.edges.reduce((inDegree, edge) => {
            return (!(edge instanceof DirectedEdge) || edge.getFromVertex() !== this)
                ? inDegree + 1
                : inDegree;
        }, 0);
    }

    /**
     * @return {number}
     */
    getOutDegree() {
        return this.getIncidentVertices().length;
    }
}

module.exports = Vertex;
