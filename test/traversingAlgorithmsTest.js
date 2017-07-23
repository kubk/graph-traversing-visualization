"use strict";

const assert = require('chai').assert;
const breadFirstSearch = require('../src/model/traversing-algorithms').bfs;
const depthFirstSearch = require('../src/model/traversing-algorithms').dfs;
const Vertex = require('../src/model/Vertex');

describe('Traversing algorithms', () => {
    const v1 = new Vertex(1);
    const v2 = new Vertex(2);
    const v3 = new Vertex(3);
    const v4 = new Vertex(4);
    const v5 = new Vertex(5);
    const v6 = new Vertex(6);
    const v7 = new Vertex(7);

    /**
     *   4
     *  /
     * 1 <--\
     * |     |
     * \---> 2 -- 3 --> 5
     *       \
     *        6 -- 7
     */
    v1.createDirectedEdgeTo(v2);
    v2.createDirectedEdgeTo(v1);
    v4.createUndirectedEdgeTo(v1);
    v2.createUndirectedEdgeTo(v3);
    v3.createDirectedEdgeTo(v5);
    v2.createUndirectedEdgeTo(v6);
    v6.createUndirectedEdgeTo(v7);

    it('bfs', () => {
        assert.deepEqual(breadFirstSearch(v2), [v2, v1, v3, v6, v4, v5, v7]);
        assert.deepEqual(breadFirstSearch(v3), [v3, v2, v5, v1, v6, v4, v7]);
        assert.deepEqual(breadFirstSearch(v5), [v5]);
    });

    it('dfs', () => {
        assert.deepEqual(depthFirstSearch(v5), [v5]);
        assert.deepEqual(depthFirstSearch(v2), [v2, v6, v7, v3, v5, v1, v4]);
    });
});
