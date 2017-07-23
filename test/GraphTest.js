'use strict';

const assert = require('chai').assert;
const Graph = require('../src/model/Graph');
const sinon = require('sinon');

describe('Graph', function () {
    let graph;

    beforeEach(() => {
        graph = new Graph;
    });

    it('contains added vertex', () => {
        const vertex = graph.createVertexWithPosition();
        assert.isTrue(graph.containsVertex(vertex));
    });

    it('calls attached listeners', () => {
        const vertexCreated = sinon.spy();
        graph.on(Graph.EVENT_VERTEX_CREATED, vertexCreated);
        const vertex = graph.createVertexWithPosition();
        assert.isTrue(vertexCreated.calledOnce);

        const vertexDeleted = sinon.spy();
        graph.on(Graph.EVENT_VERTEX_DELETED, vertexDeleted);
        graph.deleteVertex(vertex);
        assert.isTrue(vertexDeleted.calledOnce);

        const edgeAdded = sinon.spy();
        graph.on(Graph.EVENT_EDGE_ADDED, edgeAdded);
        graph.addEdge({});
        assert.isTrue(edgeAdded.calledOnce);
    });

    it('deletes vertex', () => {
        const vertex = graph.createVertexWithPosition();
        assert.isTrue(graph.containsVertex(vertex));
        graph.deleteVertex(vertex);
        assert.isFalse(graph.containsVertex(vertex));
    });

    it('gives unique names for vertices', () => {
        const vertex1 = graph.createVertexWithPosition();
        const vertex2 = graph.createVertexWithPosition();
        const vertex3 = graph.createVertexWithPosition();

        assert.notEqual(vertex1.getId(), vertex2.getId());
        assert.notEqual(vertex2.getId(), vertex3.getId());
        assert.notEqual(vertex3.getId(), vertex1.getId());
    });

    it('allows to use custom name generators', () => {
        const getGenerator = function () {
            let counter = 1;
            return function () {
                return counter++;
            }
        };

        graph = new Graph(getGenerator());

        const vertex1 = graph.createVertexWithPosition();
        const vertex2 = graph.createVertexWithPosition();
        const vertex3 = graph.createVertexWithPosition();

        assert.equal(1, vertex1.getId());
        assert.equal(2, vertex2.getId());
        assert.equal(3, vertex3.getId());
    });
});
