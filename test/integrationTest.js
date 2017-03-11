'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');

var Graph = require('../src/model/Graph');
describe('Graph with vertices', function () {
    it('deletes vertex with all connected edges', function () {
        var graph = new Graph();

        var v1 = graph.createVertexWithPosition();
        var v2 = graph.createVertexWithPosition();
        var v3 = graph.createVertexWithPosition();
        var v4 = graph.createVertexWithPosition();
        var v5 = graph.createVertexWithPosition();

        /**
         *      5
         *      |
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
