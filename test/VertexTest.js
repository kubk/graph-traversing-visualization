'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var Vertex = require('../src/model/Vertex');
var sinon = require('sinon');

describe('Vertex', function () {
    it('can filter edges in-place', function () {
        var vertex = new Vertex();
        var edge1, edge2, edge3 = 1;

        vertex.addEdge(edge1);
        vertex.addEdge(edge2);
        vertex.addEdge(edge3);

        vertex.filterEdges(function (edge) {
            return Number.isInteger(edge);
        });

        assert.lengthOf(vertex.getEdges(), 1);
    });

    describe('with edges', function () {
        var v1 = new Vertex(1);
        var v2 = new Vertex(2);
        var v3 = new Vertex(3);
        var v4 = new Vertex(4);

        /**
         * 4
         * |
         * 1 -> 2
         *  \-> 3
         */
        v1.createDirectedEdgeTo(v2);
        v1.createDirectedEdgeTo(v3);
        v4.createUndirectedEdgeTo(v1);

        it('calculates in-degree and out-degree',function () {
            assert.equal(3, v1.getOutDegree());
            assert.equal(1, v1.getInDegree());

            assert.equal(1, v4.getOutDegree());
            assert.equal(1, v4.getInDegree());

            assert.equal(0, v2.getOutDegree());
            assert.equal(0, v2.getOutDegree());

            assert.equal(1, v3.getInDegree());
            assert.equal(1, v3.getInDegree());
        });

        it('calculates incident vertices', function () {
            assert.sameMembers([v1], v4.getIncidentVertices());
            assert.sameMembers([v4, v2, v3], v1.getIncidentVertices());
            expect(v2.getIncidentVertices()).to.be.empty;
            expect(v3.getIncidentVertices()).to.be.empty;
        });
    });
});
