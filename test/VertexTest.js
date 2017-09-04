'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const Vertex = require('../src/model/Vertex');
const sinon = require('sinon');

describe('Vertex', () => {
    it('can filter edges in-place', () => {
        const vertex = new Vertex();
        let edge1, edge2, edge3 = 1;

        vertex.addEdge(edge1);
        vertex.addEdge(edge2);
        vertex.addEdge(edge3);

        vertex.filterEdges(edge => Number.isInteger(edge));

        assert.lengthOf(vertex.getEdges(), 1);
    });

    describe('with edges', () => {
        const v1 = new Vertex(1);
        const v2 = new Vertex(2);
        const v3 = new Vertex(3);
        const v4 = new Vertex(4);

        /**
         * 4
         * |
         * 1 -> 2
         *  \-> 3
         */
        v1.createDirectedEdgeTo(v2);
        v1.createDirectedEdgeTo(v3);
        v4.createUndirectedEdgeTo(v1);

        it('calculates in-degree and out-degree', () => {
            assert.equal(3, v1.getOutDegree());
            assert.equal(1, v1.getInDegree());

            assert.equal(1, v4.getOutDegree());
            assert.equal(1, v4.getInDegree());

            assert.equal(0, v2.getOutDegree());
            assert.equal(0, v2.getOutDegree());

            assert.equal(1, v3.getInDegree());
            assert.equal(1, v3.getInDegree());
        });

        it('calculates incident vertices', () => {
            assert.sameMembers([v1], v4.getAdjacentVertices());
            assert.sameMembers([v4, v2, v3], v1.getAdjacentVertices());
            expect(v2.getAdjacentVertices()).to.be.empty;
            expect(v3.getAdjacentVertices()).to.be.empty;
        });
    });
});
