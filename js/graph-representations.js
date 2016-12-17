function buildAdjacencyListHtml(verticesList) {
    if (!verticesList.length) {
        return '';
    }
    var arrow = "&rarr;",
        resultHtml = "<table><tr><th>Vertex</th><th>Adjacent vertices</th></tr>";
    verticesList.forEach(function (vertex) {
        resultHtml += "<tr><td>"
            + vertex.getId()
            + "</td><td>"
            + vertex.getIncidentVertices().map(function (vertex) {
                return vertex.getId();
            }).join(arrow)
            + "</td></tr>";
    });
    return resultHtml + "</table>";
}

function verticesListToAdjacencyMatrix(verticesList) {
    return verticesList.map(function (vertex) {
        return verticesList.map(function (vertexInRow) {
            return vertex.getIncidentVertices().filter(function (vertex) {
                return vertex === vertexInRow;
            }).length;
        });
    });
}

function adjacencyMatrixToHtmlTable(adjacencyMatrix, verticesList) {
    if (!verticesList.length) {
        return '';
    }
    var resultHtml = "<table><tr><th></th>";
    resultHtml += verticesList.map(function (vertex) {
        return "<th>" + vertex.getId() + "</th>";
    }).join('');
    resultHtml += "</tr>";
    var i = 0;
    resultHtml += verticesList.map(function (vertex) {
        return "<tr><td>" + vertex.getId() + "</td>"
            + adjacencyMatrix[i++].map(function (field) {
                return "<td>" + field + "</td>";
            }).join('')
            + "</tr>";
    }).join('');
    return resultHtml + "</table>";
}

function edgesListToIncidenceMatrix(edgesList, verticesList) {
    var incidenceMatrix = _createEmpty2dArray(verticesList.length, edgesList.length);
    var FROM_VERTEX = -1;
    var TO_VERTEX = 1;

    var columnCounter = 0;
    for (var i = 0; i < edgesList.length; i++) {
        var edge = edgesList[i];
        var fromIndex = verticesList.indexOf(edge.getVertices()[0]);
        var toIndex = verticesList.indexOf(edge.getVertices()[1]);
        var fromValue = (edge instanceof DirectedEdge) ? FROM_VERTEX : TO_VERTEX;
        var toValue = TO_VERTEX;
        incidenceMatrix[fromIndex][columnCounter] = fromValue;
        incidenceMatrix[toIndex][columnCounter++] = toValue;
    }
    return incidenceMatrix;
}

function _createEmpty2dArray(rows, rowLength) {
    var array = [];
    var fillWith = 0;
    for (var i = 0; i < rows; i++) {
        array[i] = [];
        for (var j = 0; j < rowLength; j++) {
            array[i].push(fillWith);
        }
    }
    return array;
}

function incidenceMatrixToHtmlTable(incidenceMatrix) {
    if (!incidenceMatrix.length || incidenceMatrix.every(function (row) { return row.length === 0})) {
        return '';
    }
    var resultHtml = "<table><tr><th colspan='100%'>Incidence Matrix</th></tr>";
    resultHtml += incidenceMatrix.map(function (row) {
        return "<tr>" + row.map(function (el) {
                return "<td>" + el + "</td>";
            }).join('') + "</tr>";
    }).join('');
    return resultHtml + "</table>";
}


