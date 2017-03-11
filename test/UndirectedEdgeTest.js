'use strict';

var assert = require('chai').assert;
var UndirectedEdge = require('../src/model/UndirectedEdge');

describe('DirectedEdge', function () {
    var vertexA = {addEdge: function () {}};
    var vertexB = {addEdge: function () {}};

    var undirectedEdge = new UndirectedEdge(vertexA, vertexB);

    it('returns correct incident vertex', function () {
        assert.equal(vertexA, undirectedEdge.getIncidentVertexTo(vertexB));
        assert.equal(vertexB, undirectedEdge.getIncidentVertexTo(vertexA));
    });

    it('throws an exception if argument for getIncidentVertexTo was not added to the edge', function () {
        assert.throws(function () {
            undirectedEdge.getIncidentVertexTo('foo');
        });
    });

    it('contains added vertex', function () {
        assert.isTrue(undirectedEdge.containsVertex(vertexB));
        assert.isTrue(undirectedEdge.containsVertex(vertexA));
    });
});
