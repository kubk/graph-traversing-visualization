function Vertex(id, position) {
    this._id = id;
    this._edges = [];
    this._position = (position instanceof Position) ? position : null;
    this._circleRadius = 20;
}

Vertex.prototype.getPosition = function() {
    return this._position;
};

Vertex.prototype.setPosition = function(position) {
    if (!(position instanceof Position)) {
        throw new TypeError('Argument must be of type Position');
    }
    this._position = position;
};

Vertex.prototype.getId = function() {
    return this._id;
};

Vertex.prototype.filterEdges = function (callback) {
    this._edges = this._edges.filter(callback);
}

Vertex.prototype.addEdge = function(edge) {
    if (!(edge instanceof Edge)) {
        throw new TypeError('Argument must be of type Edge');
    }
    this._edges.push(edge);
};

Vertex.prototype.createDirectedEdgeTo = function(vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }
    return new DirectedEdge(this, vertex);
};

Vertex.prototype.createUndirectedEdgeTo = function(vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }
    return new UndirectedEdge(this, vertex);
};

Vertex.prototype.getIncidentVertices = function() {
    var incidentVertices = [];
    var that = this;
    this._edges.forEach(function(edge) {
        if (edge instanceof UndirectedEdge || edge.getFromVertex() === that) {
            incidentVertices.push(edge.getIncidentVertexTo(that));
        }
    });
    return incidentVertices;
};

Vertex.prototype.getInDegree = function () {
    var inDegree = 0;
    var that = this;
    this._edges.forEach(function (edge) {
        if (edge instanceof UndirectedEdge || edge.getFromVertex() !== that) {
            inDegree++;
        }
    });
    return inDegree;
};

Vertex.prototype.getOutDegree = function () {
    var outDegree = 0;
    var that = this;
    this._edges.forEach(function (edge) {
        if (edge instanceof UndirectedEdge || (edge.getFromVertex() === that)) {
            outDegree++;
        }
    });
    return outDegree;
};

Vertex.prototype.getRadius = function() {
    return this._circleRadius;
};