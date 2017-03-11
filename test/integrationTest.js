'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');

var Graph = require('../src/model/Graph');
describe('Graph with vertices', function () {
    it('deletes vertex with all connected edges', function () {
        var graph = new Graph();

        var vertex1 = graph.createVertexWithPosition();
        var vertex2 = graph.createVertexWithPosition();
        var vertex3 = graph.createVertexWithPosition();
        var vertex4 = graph.createVertexWithPosition();
        var vertex5 = graph.createVertexWithPosition();

        /**
         *      5
         *      |
         * 1 -> 2 -> 3 <- 4
         */
        vertex1.createDirectedEdgeTo(vertex2);
        vertex5.createUndirectedEdgeTo(vertex2);
        vertex2.createDirectedEdgeTo(vertex3);
        vertex4.createDirectedEdgeTo(vertex3);

        /**
         *   5
         * 1 3 <- 4
         */
        graph.deleteVertex(vertex2);
        assert.isFalse(graph.containsVertex(vertex2));
        assert.lengthOf(vertex1.getEdges(), 0);
        assert.lengthOf(vertex5.getEdges(), 0);
        assert.lengthOf(vertex3.getEdges(), 1);
        assert.lengthOf(vertex4.getEdges(), 1);
    });
});
