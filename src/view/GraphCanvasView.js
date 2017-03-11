"use strict";

module.exports = GraphCanvasView;
var CanvasHelper = require('../CanvasHelper');
var Graph = require('../model/Graph');
var Position = require('../model/Position');

/**
 * @param {Graph} graph
 * @param {HTMLCanvasElement} canvas
 * @constructor
 */
function GraphCanvasView(graph, canvas) {
    this._graph = graph;
    this._canvas = canvas;
    this._canvasHelper = new CanvasHelper(canvas);
    this._dragVertex = null;
    this._uncompletedEdge = null;
    this._selectedVertex = null;
    this._canvas.addEventListener('click', this._onClickListener.bind(this));
    this._canvas.addEventListener('contextmenu', this._onContextMenuListener.bind(this));
    this._canvas.addEventListener('mousemove', this._onMousemoveListener.bind(this));
    this._canvas.addEventListener('mouseup', this._onMouseupListener.bind(this));
    this._canvas.addEventListener('mousedown', this._onMousedownListener.bind(this));
    this._graph.on(Graph.EVENT_VERTEX_CREATED, this._drawVertex.bind(this));
    this._selectedVertexColor = '#0f0';
    this._vertexRadius = 20;
}

/**
 * @param {Vertex} vertex
 */
GraphCanvasView.prototype.setVertexAsSelected = function (vertex) {
    if (!this._graph.containsVertex(vertex)) {
        throw new Error('Attempt to select not added vertex');
    }

    this._selectedVertex = vertex;
    this.redraw();
};

/**
 * @return {Vertex|null}
 */
GraphCanvasView.prototype.getSelectedVertex = function () {
    return this._selectedVertex;
};

GraphCanvasView.prototype.discardSelectedVertex = function () {
    this._selectedVertex = null;
};

/**
 * @param {Position} position
 * @return {Vertex|null}
 * @private
 */
GraphCanvasView.prototype._getVertexByPosition = function (position) {
    var that = this;
    return this._graph.getVerticesList().find(function (vertex) {
        return that._checkPositionIsInCircle(position, vertex.getPosition(), that._vertexRadius);
    });
};

/**
 * @param {Position} position
 * @param {Position} circlePosition
 * @param {number} circleRadius
 * @return {boolean}
 */
GraphCanvasView.prototype._checkPositionIsInCircle = function (position, circlePosition, circleRadius) {
    return Math.pow(position.getX() - circlePosition.getX(), 2)
        + Math.pow(position.getY() - circlePosition.getY(), 2)
        <= Math.pow(circleRadius, 2);
};


GraphCanvasView.prototype.redraw = function () {
    this._canvasHelper.clearCanvas();
    var splittedEdges = this._splitEdgesByVertices(this._graph.getEdgesList());
    var that = this;
    splittedEdges.forEach(function (edges) {
        that._canvasHelper.drawEdges(edges);
    });
    this._graph.getVerticesList().forEach(function (vertex) {
        var color = (vertex === that._selectedVertex) ? that._selectedVertexColor : null;
        that._canvasHelper.drawCircle(vertex.getPosition(), that._vertexRadius, vertex.getId(), color);
    });
};

/**
 * @param {Edge[]} edges
 * @return {Array}
 * @private
 */
GraphCanvasView.prototype._splitEdgesByVertices = function (edges) {
    var hashMap = [];
    edges.forEach(function (edge) {
        var getId = function (vertex) {
            return vertex.getId();
        };
        var hash = edge.getVertices().map(getId).sort().join('');
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

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onClickListener = function (event) {
    var clickPosition = this._getEventPosition(event);
    var vertex = this._getVertexByPosition(clickPosition);
    if (!this._dragVertex && !vertex) {
        this._graph.createVertexWithPosition(clickPosition);
    } else if (vertex && this._ctrlKeyIsPressed(event)) {
        this.setVertexAsSelected(vertex);
    }
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onContextMenuListener = function (event) {
    event.preventDefault();
    var clickPosition = this._getEventPosition(event);
    var vertex = this._getVertexByPosition(clickPosition);
    if (this._ctrlKeyIsPressed(event) && vertex) {
        this._graph.deleteVertex(vertex);
    } else if (vertex) {
        if (this._uncompletedEdge) {
            var vertexFrom = this._getVertexByPosition(this._uncompletedEdge);
            if (document.getElementById('directed-edge').checked) {
                this._graph.addEdge(vertexFrom.createDirectedEdgeTo(vertex));
            } else {
                this._graph.addEdge(vertexFrom.createUndirectedEdgeTo(vertex));
            }
            this._uncompletedEdge = null;
            this.redraw();
        } else if (vertex) {
            this._uncompletedEdge = vertex.getPosition();
        }
    } else if (this._uncompletedEdge && !vertex) {
        this._uncompletedEdge = null;
        this.redraw();
    }
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onMousemoveListener = function (event) {
    var mousePosition = this._getEventPosition(event);
    if (this._uncompletedEdge) {
        this.redraw();
        var isEdgeDirected = document.getElementById('directed-edge').checked;
        this._canvasHelper.drawLine(isEdgeDirected, this._uncompletedEdge, mousePosition);
    } else if (this._dragVertex) {
        this._dragVertex.setPosition(mousePosition);
        this.redraw();
    }
};

GraphCanvasView.prototype._onMouseupListener = function () {
    if (this._dragVertex) {
        this._dragVertex = null;
        this.redraw();
    }
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onMousedownListener = function (event) {
    var vertex = this._getVertexByPosition(this._getEventPosition(event));
    if (!vertex) {
        return false;
    }
    this._dragVertex = vertex;
};

/**
 * @param {Event} event
 * @return {Position}
 * @private
 */
GraphCanvasView.prototype._getEventPosition = function (event) {
    var boundingClientRect = this._canvas.getBoundingClientRect();
    return new Position(
        parseInt(event.clientX - boundingClientRect.left),
        parseInt(event.clientY - boundingClientRect.top)
    );
};

/**
 * @param {Event} event
 * @return {boolean}
 * @private
 */
GraphCanvasView.prototype._ctrlKeyIsPressed = function (event) {
    return event.ctrlKey || event.metaKey;
};

/**
 * @param {Vertex} vertex
 * @private
 */
GraphCanvasView.prototype._drawVertex = function (vertex) {
    this._canvasHelper.drawCircle(vertex.getPosition(), this._vertexRadius, vertex.getId());
};

/**
 * TODO: delete this
 * @return {CanvasHelper}
 */
GraphCanvasView.prototype.getCanvasHelper = function () {
    return this._canvasHelper;
};

/**
 * @return {number}
 */
GraphCanvasView.prototype.getVertexRadius = function () {
    return this._vertexRadius;
};