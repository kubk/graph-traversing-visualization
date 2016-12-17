function VerticesTraversingAnimation(canvasHelper) {
    this._canvasHelper = canvasHelper;
    this._vertexVisitDelay = 500;
}

VerticesTraversingAnimation.prototype.setVertexVisitDelay = function (delay) {
    if (!Number.isInteger(delay) || delay < 0) {
        throw new Error('Delay must be a positive integer, given: ' + delay);
    }
    this._vertexVisitDelay = delay;
};

VerticesTraversingAnimation.prototype.animate = function (visitedVertices) {
    var currentVertex = visitedVertices.shift();
    if (currentVertex) {
        console.log(currentVertex);
        this._canvasHelper.drawCircle(
            currentVertex.getPosition(),
            currentVertex.getRadius() + 10,
            currentVertex.getId(),
            "#f00"
        );
        setTimeout(this.animate.bind(this, visitedVertices), this._vertexVisitDelay);
    } else {
        alert('Animation completed');
    }
};
