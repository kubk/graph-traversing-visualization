"use strict";

var assert = require('chai').assert;
var GraphConverter = require('../src/model/GraphConverter');
var Graph = require('../src/model/Graph');
var DirectedEdge = require('../src/model/DirectedEdge');
var UndirectedEdge = require('../src/model/UndirectedEdge');

describe('GraphConverter', function () {
    var graphConverter = new GraphConverter();
    var graph = new Graph();
    var v1 = graph.createVertexWithPosition();
    var v2 = graph.createVertexWithPosition();
    var v3 = graph.createVertexWithPosition();
    var v4 = graph.createVertexWithPosition();

    /**
     *   4
     *  /|\
     * | | |
     *  \|/
     *   1 -> 2
     *    \-> 3
     */
    graph.addEdge(new DirectedEdge(v1, v2));
    graph.addEdge(new DirectedEdge(v1, v3));
    graph.addEdge(new UndirectedEdge(v4, v1));
    graph.addEdge(new UndirectedEdge(v4, v1));
    graph.addEdge(new UndirectedEdge(v4, v1));

    it('converts graph to adjacency matrix', function () {
        assert.deepEqual(
            [
        //       1  2  3  4
        /* 1 */ [0, 1, 1, 3],
        /* 2 */ [0, 0, 0, 0],
        /* 3 */ [0, 0, 0, 0],
        /* 4 */ [3, 0, 0, 0]
            ],
            graphConverter.toAdjacencyMatrix(graph)
        )
    });

    it('converts graph to incidence matrix', function () {
        assert.deepEqual(
            [
        /* 1 */ [-1, -1, 1, 1, 1],
        /* 2 */ [ 1,  0, 0, 0, 0],
        /* 3 */ [ 0,  1, 0, 0, 0],
        /* 4 */ [ 0,  0, 1, 1, 1]
            ],
            graphConverter.toIncidenceMatrix(graph)
        );
    });
});