"use strict";

module.exports = {
    bfs: breadthFirstSearch,
    dfs: depthFirstSearch
};

/**
 * @param {Vertex} vertex
 * @returns {Vertex[]}
 */
function depthFirstSearch(vertex) {
    var stack = [vertex],
        visited = [];

    while (stack.length) {
        var current = stack.pop();
        if (visited.indexOf(current) !== -1) {
            continue;
        }
        visited.push(current);
        current.getIncidentVertices().forEach(function (incident) {
            stack.push(incident);
        });
    }

    return visited;
}

/**
 * @param {Vertex} vertex
 * @returns {Vertex[]}
 */
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
        currentVertex.getIncidentVertices().forEach(function (nextVertex) {
            queue.push(nextVertex);
        });
    } while (queue.length);

    return visitedVertices;
}
