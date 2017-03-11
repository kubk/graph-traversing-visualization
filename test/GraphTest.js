'use strict';

var assert = require('chai').assert;
var Graph = require('../src/model/Graph');
var sinon = require('sinon');

describe('Graph', function () {
    var graph;

    beforeEach(function () {
        graph = new Graph;
    });

    it('contains added vertex', function () {
        var vertex = graph.createVertexWithPosition();
        assert.isTrue(graph.containsVertex(vertex));
    });

    it('calls attached listeners', function () {
        var vertexCreated = sinon.spy();
        graph.on(Graph.EVENT_VERTEX_CREATED, vertexCreated);
        var vertex = graph.createVertexWithPosition();
        assert.isTrue(vertexCreated.calledOnce);

        var vertexDeleted = sinon.spy();
        graph.on(Graph.EVENT_VERTEX_DELETED, vertexDeleted);
        graph.deleteVertex(vertex);
        assert.isTrue(vertexDeleted.calledOnce);

        var edgeAdded = sinon.spy();
        graph.on(Graph.EVENT_EDGE_ADDED, edgeAdded);
        graph.addEdge({});
        assert.isTrue(edgeAdded.calledOnce);
    });

    it('deletes vertex', function () {
        var vertex = graph.createVertexWithPosition();
        assert.isTrue(graph.containsVertex(vertex));
        graph.deleteVertex(vertex);
        assert.isFalse(graph.containsVertex(vertex));
    });

    it('gives unique names for vertices', function () {
        var vertex1 = graph.createVertexWithPosition();
        var vertex2 = graph.createVertexWithPosition();
        var vertex3 = graph.createVertexWithPosition();

        assert.notEqual(vertex1.getId(), vertex2.getId());
        assert.notEqual(vertex2.getId(), vertex3.getId());
        assert.notEqual(vertex3.getId(), vertex1.getId());
    });

    it('allows to use custom name generators', function () {
        var getGenerator = function () {
            var counter = 1;
            return function () {
                return counter++;
            }
        };

        graph = new Graph(getGenerator());

        var vertex1 = graph.createVertexWithPosition();
        var vertex2 = graph.createVertexWithPosition();
        var vertex3 = graph.createVertexWithPosition();

        assert.equal(1, vertex1.getId());
        assert.equal(2, vertex2.getId());
        assert.equal(3, vertex3.getId());
    });
});
