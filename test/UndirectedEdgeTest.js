'use strict';

var assert = require('chai').assert;
var UndirectedEdge = require('../src/model/UndirectedEdge');

describe('DirectedEdge', function () {
    var vertexA = {addEdge: function () {}};
    var vertexB = {addEdge: function () {}};

    var directedEdge = new UndirectedEdge(vertexA, vertexB);

    it('returns correct incident vertex', function () {
        assert.equal(vertexA, directedEdge.getIncidentVertexTo(vertexB));
        assert.equal(vertexB, directedEdge.getIncidentVertexTo(vertexA));
    });

    it('throws an exception if argument for getIncidentVertexTo was not added to the edge', function () {
        assert.throws(function () {
            directedEdge.getIncidentVertexTo('foo');
        });
    });

    it('contains added vertex', function () {
        assert.isTrue(directedEdge.containsVertex(vertexB));
        assert.isTrue(directedEdge.containsVertex(vertexA));
    });
});
