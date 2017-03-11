'use strict';

var assert = require('assert');
var DirectedEdge = require('../src/model/DirectedEdge');

describe('DirectedEdge', function () {
    var fromVertex = {addEdge: function () {}};
    var toVertex = {addEdge: function () {}};

    var directedEdge = new DirectedEdge(fromVertex, toVertex);

    it('returns valid start vertex', function () {
        assert.equal(directedEdge.getFromVertex(), fromVertex);
    });

    it('returns correct incident vertex', function () {
        assert.equal(fromVertex, directedEdge.getIncidentVertexTo(toVertex));
        assert.equal(toVertex, directedEdge.getIncidentVertexTo(fromVertex));
    });

    it('throws an exception if argument for getIncidentVertexTo was not added to the edge', function () {
        assert.throws(function () {
            directedEdge.getIncidentVertexTo('foo');
        });
    });

    it('contains added vertex', function () {
        assert.ok(directedEdge.containsVertex(fromVertex));
        assert.ok(directedEdge.containsVertex(toVertex));
    });
});
