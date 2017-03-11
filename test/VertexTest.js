'use strict';

var assert = require('chai').assert;
var Vertex = require('../src/model/Vertex');
var sinon = require('sinon');

describe('Vertex', function () {
    var vertex;

    beforeEach(function () {
        vertex = new Vertex();
    });

    it('can filter edges in-place', function () {
        var edge1, edge2, edge3 = 1;

        vertex.addEdge(edge1);
        vertex.addEdge(edge2);
        vertex.addEdge(edge3);

        vertex.filterEdges(function (edge) {
            return Number.isInteger(edge);
        });

        assert.equal(1, vertex.getEdges().length);
    });
});
