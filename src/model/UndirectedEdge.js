"use strict";

/**
 * Represents a two-way edge
 */
class UndirectedEdge {
    /**
     * @param {Vertex} fromVertex
     * @param {Vertex} toVertex
     */
    constructor(fromVertex, toVertex) {
        this.fromVertex = fromVertex;
        this.toVertex = toVertex;
        fromVertex.addEdge(this);
        toVertex.addEdge(this);
    }

    /**
     * @return {Vertex[]}
     */
    getVertices() {
        return [this.fromVertex, this.toVertex];
    }

    /**
     * @param {Vertex} vertex
     * @return {boolean}
     */
    containsVertex(vertex) {
        return this.getVertices().includes(vertex);
    }

    /**
     * @param {Vertex} vertex
     * @return {Vertex}
     */
    getIncidentVertexTo(vertex) {
        switch (vertex) {
            case this.fromVertex: return this.toVertex;
            case this.toVertex: return this.fromVertex;
            default: throw new Error('Invalid vertex: ' + vertex);
        }
    }

    /**
     * @param {Vertex} vertex
     * @return {bool}
     */
    startsWith(vertex) {
        return this.containsVertex(vertex);
    }

    /**
     * @param {Vertex} vertex
     * @return {bool}
     */
    endsWith(vertex) {
        return this.containsVertex(vertex);
    }
}

module.exports = UndirectedEdge;
