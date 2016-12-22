function DirectedEdge(fromVertex, toVertex) {
    Edge.call(this, fromVertex, toVertex);
    this._fromVertex = fromVertex;
    this._toVertex = toVertex;
    fromVertex.addEdge(this);
    toVertex.addEdge(this);
}

DirectedEdge.prototype = Object.create(Edge.prototype);

DirectedEdge.prototype.getFromVertex = function () {
    return this._fromVertex;
};

DirectedEdge.prototype.getIncidentVertexTo = function (vertex) {
    if (this._fromVertex === vertex) {
        return this._toVertex;
    } else if (this._toVertex === vertex) {
        return this._fromVertex;
    } else {
        throw new Error('Invalid vertex: ' + vertex);
    }
};

