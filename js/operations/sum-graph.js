// Temporary code, full of dirty hacks. Needs solid refactoring.

function getSumForGraphs(g1, g2) {
    var unionVertices = g1.getVerticesList().map(function (v) {
        return new Vertex(v.getId(), v.getPosition());
    });
    g2.getVerticesList().forEach(function (v) {
        if (!unionVertices.find(function (uv) {
                return uv.getId() === v.getId();
            })) {
            unionVertices.push(new Vertex(v.getId(), v.getPosition()));
        }
    });

    var unionEdges = g1.getEdgesList().map(function (e) {
        var vertexA = unionVertices.find(function (v) {
            return v.getId() === e.getVertices()[0].getId();
        });
        var vertexB = unionVertices.find(function (v) {
            return v.getId() === e.getVertices()[1].getId();
        });
        if (e instanceof DirectedEdge) {
            return new DirectedEdge(vertexA, vertexB);
        } else {
            return new UndirectedEdge(vertexA, vertexB);
        }
    });
    var mapId = function (vertex) { return vertex.getId(); };
    g2.getEdgesList().forEach(function (e) {
        if (!unionEdges.find(function (ue) {
                var ueVertices = ue.getVertices().map(mapId);
                var eVertices = e.getVertices().map(mapId);
                return typeof ue === typeof e && ueVertices[0] == eVertices[0] && ueVertices[1] == eVertices[1];
            })) {
            var vertexA = unionVertices.find(function (v) {
                return v.getId() === e.getVertices()[0].getId();
            });
            var vertexB = unionVertices.find(function (v) {
                return v.getId() === e.getVertices()[1].getId();
            });
            if (e instanceof DirectedEdge) {
                unionEdges.push(new DirectedEdge(vertexA, vertexB));
            } else {
                unionEdges.push(new UndirectedEdge(vertexA, vertexB));
            }
        }
    });
    
    return new Graph(null, unionVertices, unionEdges);
}