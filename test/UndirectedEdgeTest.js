'use strict';

const assert = require('chai').assert;
const UndirectedEdge = require('../src/model/UndirectedEdge');

describe('DirectedEdge', () => {
    const vertexA = {addEdge() {}};
    const vertexB = {addEdge() {}};

    const undirectedEdge = new UndirectedEdge(vertexA, vertexB);

    it('returns correct incident vertex', () => {
        assert.equal(vertexA, undirectedEdge.getIncidentVertexTo(vertexB));
        assert.equal(vertexB, undirectedEdge.getIncidentVertexTo(vertexA));
    });

    it('throws an exception if argument for getIncidentVertexTo was not added to the edge', () => {
        assert.throws(() => {
            undirectedEdge.getIncidentVertexTo('foo');
        });
    });

    it('contains added vertex', () => {
        assert.isTrue(undirectedEdge.containsVertex(vertexB));
        assert.isTrue(undirectedEdge.containsVertex(vertexA));
    });
});
