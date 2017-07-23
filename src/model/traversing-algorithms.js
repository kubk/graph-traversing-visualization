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
    const stack = [vertex],
        visited = [];

    while (stack.length) {
        const current = stack.pop();
        if (visited.includes(current)) {
            continue;
        }
        visited.push(current);

        current.getIncidentVertices().forEach((incident) => {
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
    const queue = [vertex],
        visitedVertices = [];

    do {
        const currentVertex = queue.shift();
        if (visitedVertices.includes(currentVertex)) {
            continue;
        }
        visitedVertices.push(currentVertex);
        currentVertex.getIncidentVertices().forEach((nextVertex) => {
            queue.push(nextVertex);
        });
    } while (queue.length);

    return visitedVertices;
}
