"use strict";

const UndirectedEdge = require('./UndirectedEdge');

/**
 * Represents a one-way edge
 */
class DirectedEdge extends UndirectedEdge {
    /**
     * @param {Vertex} fromVertex
     * @param {Vertex} toVertex
     */
    constructor(fromVertex, toVertex) {
        super(fromVertex, toVertex);
    }

    /**
     * @return {Vertex}
     */
    getFromVertex() {
        return this.fromVertex;
    }
}

module.exports = DirectedEdge;
