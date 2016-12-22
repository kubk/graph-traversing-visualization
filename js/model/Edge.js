function Edge(vertexA, vertexB) {
    if (![vertexA, vertexB].every(function (v) { return v instanceof Vertex; })) {
        throw new TypeError('Vertices must be of type Vertex');
    }
    this._vertices = [vertexA, vertexB];
}

Edge.prototype.getVertices = function () {
    return this._vertices;
};

Edge.prototype.containsVertex = function (vertex) {
    return this._vertices.indexOf(vertex) !== -1;
};

Edge.prototype.getIncidentVertexTo = function () {
    throw new Error('Method declared as abstract and must be overridden');
};