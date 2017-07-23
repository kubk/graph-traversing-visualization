'use strict';

const assert = require('assert');
const DirectedEdge = require('../src/model/DirectedEdge');

describe('DirectedEdge', () => {
    const fromVertex = {addEdge() {}};
    const toVertex = {addEdge() {}};

    const directedEdge = new DirectedEdge(fromVertex, toVertex);

    it('returns valid start vertex', () => {
        assert.equal(directedEdge.getFromVertex(), fromVertex);
    });

    it('returns correct incident vertex', () => {
        assert.equal(fromVertex, directedEdge.getIncidentVertexTo(toVertex));
        assert.equal(toVertex, directedEdge.getIncidentVertexTo(fromVertex));
    });

    it('throws an exception if argument for getIncidentVertexTo was not added to the edge', () => {
        assert.throws(() => {
            directedEdge.getIncidentVertexTo('foo');
        });
    });

    it('contains added vertex', () => {
        assert.ok(directedEdge.containsVertex(fromVertex));
        assert.ok(directedEdge.containsVertex(toVertex));
    });
});
