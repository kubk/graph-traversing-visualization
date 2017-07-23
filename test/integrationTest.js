'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

const Graph = require('../src/model/Graph');
describe('Graph with vertices', () => {
    it('deletes vertex with all connected edges', () => {
        const graph = new Graph();

        const v1 = graph.createVertexWithPosition();
        const v2 = graph.createVertexWithPosition();
        const v3 = graph.createVertexWithPosition();
        const v4 = graph.createVertexWithPosition();
        const v5 = graph.createVertexWithPosition();

        /**
         *       5
         *       |
         * 1 --> 2 --> 3 <-- 4
         * |     |
         *  \---/
         */
        v1.createDirectedEdgeTo(v2);
        v5.createUndirectedEdgeTo(v2);
        v2.createDirectedEdgeTo(v3);
        v4.createDirectedEdgeTo(v3);
        v1.createUndirectedEdgeTo(v2);

        /**
         *   5
         * 1 3 <-- 4
         */
        graph.deleteVertex(v2);
        assert.isFalse(graph.containsVertex(v2));
        assert.lengthOf(v1.getEdges(), 0);
        assert.lengthOf(v5.getEdges(), 0);
        assert.lengthOf(v3.getEdges(), 1);
        assert.lengthOf(v4.getEdges(), 1);
    });
});
