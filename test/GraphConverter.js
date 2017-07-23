"use strict";

const assert = require('chai').assert;
const GraphConverter = require('../src/model/GraphConverter');
const Graph = require('../src/model/Graph');
const DirectedEdge = require('../src/model/DirectedEdge');
const UndirectedEdge = require('../src/model/UndirectedEdge');

describe('GraphConverter', () => {
    const graphConverter = new GraphConverter();
    const graph = new Graph();
    const v1 = graph.createVertexWithPosition();
    const v2 = graph.createVertexWithPosition();
    const v3 = graph.createVertexWithPosition();
    const v4 = graph.createVertexWithPosition();

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

    it('converts graph to adjacency matrix', () => {
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

    it('converts graph to incidence matrix', () => {
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