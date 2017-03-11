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
        var vertex1 = new Vertex(1);
        var vertex2 = new Vertex(2);
        var vertex3 = new Vertex(3);
        var vertex4 = new Vertex(4);

        /**
         * 4
         * |
         * 1 -> 2
         *  \-> 3
         */
        vertex1.createDirectedEdgeTo(vertex2);
        vertex1.createDirectedEdgeTo(vertex3);
        vertex4.createUndirectedEdgeTo(vertex1);

        it('calculates in-degree and out-degree',function () {
            assert.equal(3, vertex1.getOutDegree());
            assert.equal(1, vertex1.getInDegree());

            assert.equal(1, vertex4.getOutDegree());
            assert.equal(1, vertex4.getInDegree());

            assert.equal(0, vertex2.getOutDegree());
            assert.equal(0, vertex2.getOutDegree());

            assert.equal(1, vertex3.getInDegree());
            assert.equal(1, vertex3.getInDegree());
        });

        it('calculates incident vertices', function () {
            assert.sameMembers([vertex1], vertex4.getIncidentVertices());
            assert.sameMembers([vertex4, vertex2, vertex3], vertex1.getIncidentVertices());
            expect(vertex2.getIncidentVertices()).to.be.empty;
            expect(vertex3.getIncidentVertices()).to.be.empty;
        });
    });
});