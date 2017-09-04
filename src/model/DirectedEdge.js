"use strict";

const UndirectedEdge = require('./UndirectedEdge');

/**
 * Represents a one-way edge
 */
class DirectedEdge extends UndirectedEdge {
    /**
     * @param {Vertex} vertex
     * @return {bool}
     */
    startsWith(vertex) {
    	return this.fromVertex === vertex;
    }

    /**
     * @param {Vertex} vertex
     * @return {bool}
     */
    endsWith(vertex) {
    	return this.toVertex === vertex;
    }
}

module.exports = DirectedEdge;
