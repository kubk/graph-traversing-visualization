import { Vertex } from './vertex';

export type TraversingAlgorithm = (vertex: Vertex) => Vertex[];

export function depthFirstSearch(vertex: Vertex): Vertex[] {
  const stack = [vertex];
  const visitedVertices: Vertex[] = [];

  while (stack.length) {
    const currentVertex = stack.pop()!;

    if (visitedVertices.indexOf(currentVertex) !== -1) {
      continue;
    }

    visitedVertices.push(currentVertex);
    stack.push(...currentVertex.getAdjacentVertices());
  }

  return visitedVertices;
}

export function breadthFirstSearch(vertex: Vertex): Vertex[] {
  const queue: Vertex[] = [vertex];
  const visitedVertices: Vertex[] = [];

  while (queue.length) {
    const currentVertex = queue.shift()!;

    if (visitedVertices.indexOf(currentVertex) !== -1) {
      continue;
    }

    visitedVertices.push(currentVertex);
    queue.push(...currentVertex.getAdjacentVertices());
  }

  return visitedVertices;
}
