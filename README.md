# kubk/graph-traversing-visualization

Graph representation/manipulation/traversal visualization using vanilla JavaScript + Canvas API.

## Features
- Draggable vertices
- Directed (one-way)/Undirected (two-way)/Parallel edges
- Dynamic building of [adjacency matrix](https://en.wikipedia.org/wiki/Adjacency_matrix), [incidence matrix](https://en.wikipedia.org/wiki/Incidence_matrix), [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list)
- Deleting vertices (with all connected edges)
- Depth/Breadth-first search visualization
- Calculation graph operations ([sum](http://mathworld.wolfram.com/GraphSum.html), [intersection](http://mathworld.wolfram.com/GraphIntersection.html))
- Object-oriented

## Demo
Check out demo in your browser:
- [Depth/Breadth-first search visualization](https://kubk.github.io/graph-traversing-visualization/pages/graph-traversing-animation.html)
- [Calculating graph operations](https://kubk.github.io/graph-traversing-visualization/pages/graph-operations.html)

## Control
- Create vertex - Left mouse click on empty space
- Drag vertex - Press and hold down left mouse button, then move drag vertex to the desired location
- Connect vertices - Right mouse click on start/end vertex
- Delete vertex - Ctrl+right mouse click
- Set vertex as selected (for specifying start vertex of search algorithms) - Ctrl+left mouse click

## Example
![example](https://github.com/kubk/graph-traversing-visualization/blob/gh-pages/out.gif)
