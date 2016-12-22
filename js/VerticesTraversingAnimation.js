function VerticesTraversingAnimation(graphCanvasView, animationStartButton, dfsRadioButton) {
    if (!(graphCanvasView instanceof GraphCanvasView)) {
        throw new TypeError('Argument must be of type GraphCanvasView');
    }
    
    this._graphCanvasView = graphCanvasView;
    this._canvasHelper = graphCanvasView.getCanvasHelper();
    this._animationStartButton = animationStartButton;
    this._dfsRadioButton = dfsRadioButton;
    this._animationStartButton.addEventListener('click', this.startAnimation.bind(this));
    this._vertexVisitDelay = 500;
    this._visitedVertexColor = "#f00";
}

VerticesTraversingAnimation.prototype.startAnimation = function () {
    var startFromVertex = this._graphCanvasView.getSelectedVertex();
    var visitedVertices = [];
    if (!startFromVertex) {
        return alert('Select start vertex using Ctrl + left mouse click');
    }
    if (this._dfsRadioButton.checked) {
        this.depthFirstSearch(startFromVertex, visitedVertices);
    } else {
        visitedVertices = this.breadthFirstSearch(startFromVertex);
    }
    this._animateVisited(visitedVertices);
    this._graphCanvasView.discardSelectedVertex();
};

VerticesTraversingAnimation.prototype.depthFirstSearch = function (vertex, visited) {
    if (visited.indexOf(vertex) === -1) {
        visited.push(vertex);
        var that = this;
        vertex.getIncidentVertices().forEach(function (nextVertex) {
            that.depthFirstSearch(nextVertex, visited);
        });
    }
};

VerticesTraversingAnimation.prototype.breadthFirstSearch = function (vertex) {
    var queue = [vertex],
        visitedVertices = [],
        currentVertex;
    do {
        currentVertex = queue.shift();
        if (visitedVertices.indexOf(currentVertex) !== -1) {
            continue;
        }
        visitedVertices.push(currentVertex);
        currentVertex.getIncidentVertices().forEach(function (nextVertex) {
            if (visitedVertices.indexOf(nextVertex) === -1) {
                queue.push(nextVertex);
            }
        });
    } while (queue.length);
    return visitedVertices;
};

VerticesTraversingAnimation.prototype._animateVisited = function (visitedVertices) {
    var currentVertex = visitedVertices.shift();
    if (currentVertex) {
        console.log(currentVertex);
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

