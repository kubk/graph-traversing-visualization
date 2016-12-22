function Graph(generateVertexId, verticesList, edgesList) {
    EventManagerMixin.call(this);
    this._generateVertexId = generateVertexId || this._getVertexIdGenerator();
    this._edgesList = edgesList || [];
    this._verticesList = verticesList || [];
}

Graph.EVENT_VERTEX_CREATED = 'vertexCreated';
Graph.EVENT_VERTEX_DELETED = 'vertexDeleted';
Graph.EVENT_EDGE_ADDED = 'edgeAdded';

Graph.prototype.containsVertex = function (vertex) {
    return this._verticesList.indexOf(vertex) !== -1;
};

Graph.prototype.addEdge = function (edge) {
    if (!(edge instanceof Edge)) {
        throw new TypeError('Argument must be of type Edge');
    }
    this._edgesList.push(edge);
    this.trigger(Graph.EVENT_EDGE_ADDED);
};

Graph.prototype._createVertexWithPosition = function (position) {
    if (!(position instanceof Position)) {
        throw new TypeError('Argument must be of type Position');
    }
    var vertex = new Vertex(this._generateVertexId(), position);
    this._verticesList.push(vertex);
    this.trigger(Graph.EVENT_VERTEX_CREATED, vertex);
    return vertex;
};

Graph.prototype.getVerticesList = function () {
    return this._verticesList;
};

Graph.prototype.getEdgesList = function () {
    return this._edgesList;
};

Graph.prototype.deleteVertex = function (vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }

    var doesNotContainVertex = function (edge) {
        return !edge.containsVertex(vertex);
    };
    for (var i = 0; i < this._verticesList.length; i++) {
        var currentVertex = this._verticesList[i];
        currentVertex.filterEdges(doesNotContainVertex);
        if (currentVertex === vertex) {
            this._verticesList.splice(i--, 1);
            this._edgesList = this._edgesList.filter(doesNotContainVertex);
        }
    }
    this.trigger(Graph.EVENT_VERTEX_DELETED);
};

Graph.prototype._getVertexIdGenerator = function () {
    var current = 65;
    return function () {
        return String.fromCharCode(current++);
    }
};