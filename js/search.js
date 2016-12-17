function depthFirstSearch(vertex, visited) {
    if (visited.indexOf(vertex) === -1) {
        visited.push(vertex);
        vertex.getIncidentVertices().forEach(function(nextVertex) {
            depthFirstSearch(nextVertex, visited);
        });
    }
}

function breadthFirstSearch(vertex) {
    var queue = [vertex],
        visitedVertices = [],
        currentVertex;
    do {
        currentVertex = queue.shift();
        if (visitedVertices.indexOf(currentVertex) !== -1) {
            continue;
        }
        visitedVertices.push(currentVertex);
        currentVertex.getIncidentVertices().forEach(function(nextVertex) {
            if (visitedVertices.indexOf(nextVertex) === -1) {
                queue.push(nextVertex);
            }
        });
    } while (queue.length);
    return visitedVertices;
}