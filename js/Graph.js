function Graph(canvasHelper, mathHelper, generateVertexId) {
    EventManagerMixin.call(this);
    this._canvasHelper = canvasHelper;
    this._mathHelper = mathHelper;
    this._generateVertexId = generateVertexId || this._getVertexIdGenerator();
    this._edgesList = [];
    this._verticesList = [];
}

Graph.EVENT_VERTEX_CREATED = 'vertexCreated';
Graph.EVENT_VERTEX_DELETED = 'vertexDeleted';
Graph.EVENT_EDGE_ADDED = 'edgeAdded';

Graph.prototype.createVertexInPosition = function (position) {
    if (!(position instanceof Position)) {
        throw new TypeError('Argument must be of type Position');
    }
    var vertex = new Vertex(this._generateVertexId(), position);
    this._verticesList.push(vertex);
    this._canvasHelper.drawCircle(vertex.getPosition(), vertex.getRadius(), vertex.getId());
    this.trigger(Graph.EVENT_VERTEX_CREATED);
    return vertex;
};

Graph.prototype.addEdge = function (edge) {
    if (!(edge instanceof Edge)) {
        throw new TypeError('Argument must be of type Edge');
    }
    this._edgesList.push(edge);
    this.trigger(Graph.EVENT_EDGE_ADDED);
};

Graph.prototype.getVerticesList = function () {
    return this._verticesList;
};

Graph.prototype.getEdgesList = function () {
    return this._edgesList;
};

Graph.prototype.getVertex = function (position) {
    if (!(position instanceof Position)) {
        throw new TypeError('Argument must be of type Position');
    }
    for (var i = 0; i < this._verticesList.length; i++) {
        var vertex = this._verticesList[i];
        if (this._mathHelper.checkPositionIsInCircle(position, vertex.getPosition(), vertex.getRadius())) {
            return vertex;
        }
    }
    return false;
};

Graph.prototype.deleteVertex = function (vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }

    var doesNotContainVertex = function (edge) { return !edge.containsVertex(vertex); };
    for (var i = 0; i < this._verticesList.length; i++) {
        var currentVertex = this._verticesList[i];
        currentVertex.filterEdges(doesNotContainVertex);
        if (currentVertex === vertex) {
            this._verticesList.splice(i--, 1);
            this._edgesList = this._edgesList.filter(doesNotContainVertex);
        }
    }
    this.trigger(Graph.EVENT_VERTEX_DELETED);
    this.redraw();
};

Graph.prototype.redraw = function () {
    this._canvasHelper.clearCanvas();
    var splittedEdges = this._splitEdgesByVertices(this._edgesList);
    var that = this;
    splittedEdges.forEach(function (edges) {
        that._canvasHelper.drawEdges(edges);
    });
    this._verticesList.forEach(function (vertex) {
        var color = (vertex === that.selectedVertex) ? "#0f0" : null;
        that._canvasHelper.drawCircle(vertex.getPosition(), vertex.getRadius(), vertex.getId(), color);
    });
};

Graph.prototype._splitEdgesByVertices = function (edges) {
    var hashMap = [];
    edges.forEach(function (edge) {
        var hash = edge.getVertices().map(function (v) {
            return v.getId();
        }).sort().join('');
        if (hashMap[hash]) {
            hashMap[hash].push(edge);
        } else {
            hashMap[hash] = [edge];
        }
    });
    var withoutHash = [];
    for (var i in hashMap) {
        withoutHash.push(hashMap[i]);
    }
    return withoutHash;
};

Graph.prototype.setVertexAsSelected = function (vertex) {
    if (this._verticesList.indexOf(vertex) === -1) {
        throw new Error('Attempt to select not added vertex');
    }

    this.selectedVertex = vertex;
    this.redraw();
};

Graph.prototype.getSelectedVertex = function () {
    return this.selectedVertex;
};

Graph.prototype.discardSelectedVertex = function () {
    this.selectedVertex = null;
};

Graph.prototype._getVertexIdGenerator = function () {
    var current = 65;
    return function () {
        return String.fromCharCode(current++);
    }
};