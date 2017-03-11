"use strict";

module.exports = VerticesTraversingAnimation;
var EventManagerMixin = require('./model/EventManagerMixin');
var breadFirstSearch = require('./model/traversing-algorithms').bfs;
var depthFirstSearch = require('./model/traversing-algorithms').dfs;

/**
 * @param {GraphCanvasView} graphCanvasView
 * @param {Element} animationStartButton
 * @param {Element} dfsButton
 * @constructor
 */
function VerticesTraversingAnimation(graphCanvasView, animationStartButton, dfsButton) {
    EventManagerMixin.call(this);
    this._graphCanvasView = graphCanvasView;
    this._canvasHelper = graphCanvasView.getCanvasHelper();
    this._animationStartButton = animationStartButton;
    this._vertexVisitDelay = 500;
    this._visitedVertexColor = "#f00";
    this._animationStartButton.addEventListener('click', function () {
        var traversingAlgo = (dfsButton.checked) ? depthFirstSearch : breadFirstSearch;
        this.startAnimation(traversingAlgo);
    }.bind(this));
}

VerticesTraversingAnimation.EVENT_VERTEX_VISITED = 'vertexVisited';

/**
 * @param {Function} traversingAlgo
 * @private
 */
VerticesTraversingAnimation.prototype.startAnimation = function (traversingAlgo) {
    var startFromVertex = this._graphCanvasView.getSelectedVertex();
    if (!startFromVertex) {
        return alert('Select start vertex using Ctrl + left mouse click');
    }
    var visitedVertices = traversingAlgo(startFromVertex);
    this._animateVisited(visitedVertices);
    this._graphCanvasView.discardSelectedVertex();
};

/**
 * @param {Vertex[]} visitedVertices
 * @private
 */
VerticesTraversingAnimation.prototype._animateVisited = function (visitedVertices) {
    var currentVertex = visitedVertices.shift();
    if (currentVertex) {
        this.trigger(VerticesTraversingAnimation.EVENT_VERTEX_VISITED);
        this._canvasHelper.drawCircle(
            currentVertex.getPosition(),
            this._graphCanvasView.getVertexRadius() + 10,
            currentVertex.getId(),
            this._visitedVertexColor
        );
        setTimeout(this._animateVisited.bind(this, visitedVertices), this._vertexVisitDelay);
    } else {
        alert('Animation completed');
    }
};