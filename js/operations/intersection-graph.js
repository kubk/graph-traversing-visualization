// Temporary code, full of dirty hacks. Needs solid refactoring.

function getIntersectionForGraphs(g1, g2) {
    var intersectionVertices = g1.getVerticesList()
        .filter(function (v) {
            return g2.getVerticesList().find(function (v2) {
                return v2.getId() === v.getId();
            });
        })
        .map(function (v) {
            return new Vertex(v.getId(), v.getPosition());
        });

    var mapId = function (vertex) { return vertex.getId(); };
    var intersectionEdges = g1.getEdgesList()
        .filter(function (e) {
            return g2.getEdgesList().find(function (e2) {
                var eVertices = e.getVertices().map(mapId);
                var e2Vertices = e2.getVertices().map(mapId);
                return typeof e === typeof e2 && eVertices[0] == e2Vertices[0] && eVertices[1] == e2Vertices[1];
            });
        })
        .map(function (e) {
            var vertexA = intersectionVertices.find(function (v) {
                return v.getId() === e.getVertices()[0].getId();
            });
            var vertexB = intersectionVertices.find(function (v) {
                return v.getId() === e.getVertices()[1].getId();
            });
            if (e instanceof DirectedEdge) {
                return new DirectedEdge(vertexA, vertexB);
            } else {
                return new UndirectedEdge(vertexA, vertexB);
            }
        });

    return new Graph(null, intersectionVertices, intersectionEdges);
}