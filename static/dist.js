(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = CanvasHelper;
var Position = require('./model/Position');
var DirectedEdge = require('./model/DirectedEdge');

/**
 * @param {HTMLCanvasElement} canvas
 * @constructor
 */
function CanvasHelper(canvas) {
    this._context = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;
    this._fontSize = 13;
    this._ratio = 0.5;
    this._arrowLength = 20;
}

CanvasHelper.prototype.clearCanvas = function () {
    this._context.clearRect(0, 0, this._width, this._height);
};

/**
 * @param {boolean} isDirected
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @param {number} [lineWidth]
 * @param {*} [strokeStyle]
 */
CanvasHelper.prototype.drawLine = function (isDirected, fromPosition, toPosition, lineWidth, strokeStyle) {
    if (lineWidth) {
        if (!Number.isInteger(lineWidth) || lineWidth < 1) {
            throw new TypeError('LineWidth must be a positive integer, given: ' + lineWidth);
        }
        this._context.lineWidth = lineWidth;
    }
    if (strokeStyle) {
        this._context.strokeStyle = strokeStyle;
    }

    this._context.beginPath();
    this._context.moveTo(fromPosition.getX(), fromPosition.getY());
    this._context.lineTo(toPosition.getX(), toPosition.getY());
    this._context.stroke();

    if (isDirected === true) {
        this._context.beginPath();
        var positionDivInRatio = this._getPositionDividedInRatio(this._ratio, fromPosition, toPosition);
        this._drawArrow(fromPosition, toPosition, positionDivInRatio);
    }
};

/**
 * Calculates position of the point, that divides the line in a given ratio
 *
 * @param {number} ratio
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @return {Position}
 * @private
 */
CanvasHelper.prototype._getPositionDividedInRatio = function (ratio, fromPosition, toPosition) {
    return new Position(
        (fromPosition.getX() + (ratio * toPosition.getX())) / (1 + ratio),
        (fromPosition.getY() + (ratio * toPosition.getY())) / (1 + ratio)
    );
};

/**
 * @param {Position} position
 * @param {number} radius
 * @param {*} textInside
 * @param {*} [color]
 */
CanvasHelper.prototype.drawCircle = function (position, radius, textInside, color) {
    this._context.beginPath();
    this._context.arc(position.getX(), position.getY(), radius, 0, Math.PI * 2);
    this._context.fillStyle = color || "#00f";
    this._context.fill();

    this._context.font = this._fontSize + 'pt Arial';
    this._context.fillStyle = '#fff';
    this._context.textAlign = 'center';
    this._context.fillText(textInside, position.getX(), position.getY() + this._fontSize / 2);
};

/**
 * @param {Edge[]} edges
 */
CanvasHelper.prototype.drawEdges = function (edges) {
    var generateShift = this._getShiftGenerator(edges.length);
    var that = this;
    edges.forEach(function (edge) {
        var vertices = edge.getVertices(),
            fromX = vertices[0].getPosition().getX(),
            fromY = vertices[0].getPosition().getY(),
            toX = vertices[1].getPosition().getX(),
            toY = vertices[1].getPosition().getY();

        that._context.beginPath();
        that._context.moveTo(fromX, fromY);
        var shiftX = (fromX + toX) / 2;
        var shiftY = (fromY + toY) / 2;
        shiftY += generateShift();
        that._context.quadraticCurveTo(shiftX, shiftY, toX, toY);
        that._context.stroke();
        if (edge instanceof DirectedEdge) {
            that._context.beginPath();
            var arrowStartPosition = new Position(
                that._getQuadraticCurveCoord(that._ratio, fromX, shiftX, toX),
                that._getQuadraticCurveCoord(that._ratio, fromY, shiftY, toY)
            );
            that._drawArrow(vertices[0].getPosition(), vertices[1].getPosition(), arrowStartPosition);
        }
    });
};

/**
 * https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B8%D0%B2%D0%B0%D1%8F_%D0%91%D0%B5%D0%B7%D1%8C%D0%B5#.D0.9A.D0.B2.D0.B0.D0.B4.D1.80.D0.B0.D1.82.D0.B8.D1.87.D0.BD.D1.8B.D0.B5_.D0.BA.D1.80.D0.B8.D0.B2.D1.8B.D0.B5
 * @param {number} t
 * @param {number} p0
 * @param {number} p1
 * @param {number} p2
 * @return {number}
 * @private
 */
CanvasHelper.prototype._getQuadraticCurveCoord = function (t, p0, p1, p2) {
    if (t < 0 || t > 1) {
        throw new Error('Parameter t must be in range from 0 to 1');
    }
    return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
};


/**
 * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82#.D0.9F.D0.BE.D0.B2.D0.BE.D1.80.D0.BE.D1.82_.D0.B2_.D0.B4.D0.B2.D1.83.D0.BC.D0.B5.D1.80.D0.BD.D0.BE.D0.BC_.D0.BF.D1.80.D0.BE.D1.81.D1.82.D1.80.D0.B0.D0.BD.D1.81.D1.82.D0.B2.D0.B5
 * @param {Position} fromPosition
 * @param {Position} toPosition
 * @param {Position} arrowStartPosition
 * @private
 */
CanvasHelper.prototype._drawArrow = function (fromPosition, toPosition, arrowStartPosition) {
    var fromX = fromPosition.getX();
    var fromY = fromPosition.getY();
    var toX = toPosition.getX();
    var toY = toPosition.getY();

    var angle = Math.atan2(toY - fromY, toX - fromX);
    var rotationAngle = Math.PI / 6;

    var x = arrowStartPosition.getX();
    var y = arrowStartPosition.getY();

    this._context.moveTo(x, y);
    this._context.lineTo(
        x - this._arrowLength * Math.cos(angle - rotationAngle),
        y - this._arrowLength * Math.sin(angle - rotationAngle)
    );
    this._context.moveTo(x, y);
    this._context.lineTo(
        x - this._arrowLength * Math.cos(angle + rotationAngle),
        y - this._arrowLength * Math.sin(angle + rotationAngle)
    );
    this._context.stroke();
};

/**
 * @param {number} edgesCount
 * @return {Function} - Callback that generates shift for the next parallel edge
 * @private
 */
CanvasHelper.prototype._getShiftGenerator = function (edgesCount) {
    if (edgesCount < 1) {
        throw new Error('Edges count must be positive');
    }
    var distanceBetweenEdges = 50;
    var shift = (edgesCount % 2 === 0) ? distanceBetweenEdges : 0;
    return function () {
        var oldShift = shift;
        if (shift > 0) {
            shift *= -1;
        } else {
            shift = Math.abs(shift) + distanceBetweenEdges;
        }
        return oldShift;
    }
};
},{"./model/DirectedEdge":4,"./model/Position":9}],2:[function(require,module,exports){
"use strict";

module.exports = VerticesTraversingAnimation;
var EventManagerMixin = require('./model/EventManagerMixin');
var breadFirstSearch = require('./model/traversing-algorithms').bfs;
var depthFirstSearch = require('./model/traversing-algorithms').dfs;

/**
 * @param {GraphCanvasView} graphCanvasView
 * @param {Element} animationStartButton
 * @param {Element} dfsButton
 * @constructor
 */
function VerticesTraversingAnimation(graphCanvasView, animationStartButton, dfsButton) {
    EventManagerMixin.call(this);
    this._graphCanvasView = graphCanvasView;
    this._canvasHelper = graphCanvasView.getCanvasHelper();
    this._animationStartButton = animationStartButton;
    this._vertexVisitDelay = 500;
    this._visitedVertexColor = "#f00";
    this._animationStartButton.addEventListener('click', function () {
        var traversingAlgo = (dfsButton.checked) ? depthFirstSearch : breadFirstSearch;
        this.startAnimation(traversingAlgo);
    }.bind(this));
}

VerticesTraversingAnimation.EVENT_VERTEX_VISITED = 'vertexVisited';

/**
 * @param {Function} traversingAlgo
 * @private
 */
VerticesTraversingAnimation.prototype.startAnimation = function (traversingAlgo) {
    var startFromVertex = this._graphCanvasView.getSelectedVertex();
    if (!startFromVertex) {
        return alert('Select start vertex using Ctrl + left mouse click');
    }
    var visitedVertices = traversingAlgo(startFromVertex);
    this._animateVisited(visitedVertices);
    this._graphCanvasView.discardSelectedVertex();
};

/**
 * @param {Vertex[]} visitedVertices
 * @private
 */
VerticesTraversingAnimation.prototype._animateVisited = function (visitedVertices) {
    var currentVertex = visitedVertices.shift();
    if (currentVertex) {
        this.trigger(VerticesTraversingAnimation.EVENT_VERTEX_VISITED);
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
},{"./model/EventManagerMixin":6,"./model/traversing-algorithms":12}],3:[function(require,module,exports){
var Graph = require('./model/Graph');
var GraphCanvasView = require('./view/GraphCanvasView');
var GraphHtmlTableView = require('./view/GraphHtmlTableView');
var VerticesTraversingAnimation = require('./VerticesTraversingAnimation');
var GraphConverter = require('./model/GraphConverter');

var graph = new Graph();
var graphHtmlTableView = new GraphHtmlTableView(graph, new GraphConverter());

window.addEventListener('load', function () {
    var graphCanvasView = new GraphCanvasView(graph, document.getElementById('canvas'));
    var verticesTraversingAnimation = new VerticesTraversingAnimation(
        graphCanvasView,
        document.getElementById('start-search'),
        document.getElementById('depth-first-search')
    );
});
},{"./VerticesTraversingAnimation":2,"./model/Graph":7,"./model/GraphConverter":8,"./view/GraphCanvasView":13,"./view/GraphHtmlTableView":14}],4:[function(require,module,exports){
"use strict";

module.exports = DirectedEdge;
var Edge = require('./Edge');

/**
 * Represents a one-way edge
 *
 * @param {Vertex} fromVertex
 * @param {Vertex} toVertex
 * @constructor
 */
function DirectedEdge(fromVertex, toVertex) {
    Edge.call(this, fromVertex, toVertex);
    this._fromVertex = fromVertex;
    this._toVertex = toVertex;
    fromVertex.addEdge(this);
    toVertex.addEdge(this);
}

DirectedEdge.prototype = Object.create(Edge.prototype);

/**
 * @return {Vertex}
 */
DirectedEdge.prototype.getFromVertex = function () {
    return this._fromVertex;
};

/**
 * @param {Vertex} vertex
 * @return {Vertex}
 */
DirectedEdge.prototype.getIncidentVertexTo = function (vertex) {
    switch (vertex) {
        case this._fromVertex: return this._toVertex;
        case this._toVertex: return this._fromVertex;
        default: throw new Error('Invalid vertex: ' + vertex)
    }
};
},{"./Edge":5}],5:[function(require,module,exports){
"use strict";

module.exports = Edge;
var Vertex = require('./Vertex');

/**
 * Abstract edge
 * 
 * @param {Vertex} vertexA
 * @param {Vertex} vertexB
 * @constructor
 */
function Edge(vertexA, vertexB) {
    this._vertices = [vertexA, vertexB];
}

/**
 * @return {Vertex[]}
 */
Edge.prototype.getVertices = function () {
    return this._vertices;
};

/**
 * @param {Vertex} vertex
 * @return {boolean}
 */
Edge.prototype.containsVertex = function (vertex) {
    return this._vertices.indexOf(vertex) !== -1;
};

Edge.prototype.getIncidentVertexTo = function () {
    throw new Error('Method declared as abstract and must be overridden');
};
},{"./Vertex":11}],6:[function(require,module,exports){
"use strict";

module.exports = EventManagerMixin;

/**
 * Simple mixin for managing events
 *
 * @constructor
 */
function EventManagerMixin() {
    this._eventHandlers = {};
    
    /**
     * @param {*} eventName
     */
    this.on = function (eventName) {
        var handlers = [].slice.call(arguments, 1);
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        var that = this;
        handlers.forEach(function (handler) {
            that._eventHandlers[eventName].push(handler);
        });
    };

    /**
     * @param {*} eventName
     * @return {boolean}
     */
    this.trigger = function (eventName) {
        if (!this._eventHandlers[eventName]) {
            return false;
        }

        var handlerArguments = [].slice.call(arguments, 1);
        this._eventHandlers[eventName].forEach(function (handler) {
            handler.apply(this, handlerArguments);
        });
    };
}
},{}],7:[function(require,module,exports){
"use strict";

module.exports = Graph;
var EventManagerMixin = require('./EventManagerMixin');
var Edge = require('./Edge');
var Vertex = require('./Vertex');

/**
 * @param {Function} [generateVertexId]
 * @param {Vertex[]} [verticesList]
 * @param {Edge[]} [edgesList]
 * @constructor
 */
function Graph(generateVertexId, verticesList, edgesList) {
    EventManagerMixin.call(this);
    this._generateVertexId = generateVertexId || this._getVertexIdGenerator();
    this._edgesList = edgesList || [];
    this._verticesList = verticesList || [];
}

Graph.EVENT_VERTEX_CREATED = 'vertexCreated';
Graph.EVENT_VERTEX_DELETED = 'vertexDeleted';
Graph.EVENT_EDGE_ADDED = 'edgeAdded';

/**
 * @param {Vertex} vertex
 * @return {boolean}
 */
Graph.prototype.containsVertex = function (vertex) {
    return this._verticesList.indexOf(vertex) !== -1;
};

/**
 * @param {Edge} edge
 */
Graph.prototype.addEdge = function (edge) {
    this._edgesList.push(edge);
    this.trigger(Graph.EVENT_EDGE_ADDED);
};

/**
 * @param {Position} position
 * @return {Vertex}
 */
Graph.prototype.createVertexWithPosition = function (position) {
    var vertex = new Vertex(this._generateVertexId(), position);
    this._verticesList.push(vertex);
    this.trigger(Graph.EVENT_VERTEX_CREATED, vertex);
    return vertex;
};

/**
 * @return {Vertex[]}
 */
Graph.prototype.getVerticesList = function () {
    return this._verticesList;
};

/**
 * @return {Edge[]}
 */
Graph.prototype.getEdgesList = function () {
    return this._edgesList;
};

/**
 * @param {Vertex} vertex
 */
Graph.prototype.deleteVertex = function (vertex) {
    if (!(vertex instanceof Vertex)) {
        throw new TypeError('Argument must be of type Vertex');
    }

    var doesNotContainVertex = function (edge) {
        return !edge.containsVertex(vertex);
    };
    for (var i = 0; i < this._verticesList.length; i++) {
        var currentVertex = this._verticesList[i];
        currentVertex.filterEdges(doesNotContainVertex);
        if (currentVertex === vertex) {
            this._verticesList.splice(i--, 1);
            this._edgesList = this._edgesList.filter(doesNotContainVertex);
        }
    }
    this.trigger(Graph.EVENT_VERTEX_DELETED);
};

/**
 * @return {Function}
 * @private
 */
Graph.prototype._getVertexIdGenerator = function () {
    var current = 65;
    return function () {
        return String.fromCharCode(current++);
    }
};
},{"./Edge":5,"./EventManagerMixin":6,"./Vertex":11}],8:[function(require,module,exports){
"use strict";

module.exports = GraphConverter;
var DirectedEdge = require('./DirectedEdge');

function GraphConverter() {
    /**
     * @param {Graph} graph
     * @return {Array}
     */
    this.toAdjacencyMatrix = function (graph) {
        var vertices = graph.getVerticesList();

        return vertices.map(function (vertex) {
            return vertices.map(function (vertexInRow) {
                return vertex.getIncidentVertices().filter(function (vertex) {
                    return vertex === vertexInRow;
                }).length;
            });
        });
    };

    /**
     * @param {Graph} graph
     * @return {Array}
     */
    this.toIncidenceMatrix = function (graph) {
        var edges = graph.getEdgesList();
        var vertices = graph.getVerticesList();
        var incidenceMatrix = this._createEmpty2dArray(vertices.length, edges.length);
        var FROM_VERTEX = -1;
        var TO_VERTEX = 1;

        var columnCounter = 0;
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var fromIndex = vertices.indexOf(edge.getVertices()[0]);
            var toIndex = vertices.indexOf(edge.getVertices()[1]);
            var fromValue = (edge instanceof DirectedEdge) ? FROM_VERTEX : TO_VERTEX;
            var toValue = TO_VERTEX;
            incidenceMatrix[fromIndex][columnCounter] = fromValue;
            incidenceMatrix[toIndex][columnCounter++] = toValue;
        }

        return incidenceMatrix;
    };

    /**
     * @param {number} rows
     * @param {number} rowLength
     * @return {Array}
     * @private
     */
    this._createEmpty2dArray = function (rows, rowLength) {
        var arr = new Array(rows);
        for(var i = 0; i < arr.length; i++){
            arr[i] = (new Array(rowLength)).fill(0);
        }
        return arr;
    };
}

},{"./DirectedEdge":4}],9:[function(require,module,exports){
"use strict";

module.exports = Position;

function Position(x, y) {
    this.setX(x);
    this.setY(y);
}

Position.prototype.setX = function (x) {
    if (x < 0) {
        throw new TypeError('Invalid argument');
    }
    this._x = x;
};

Position.prototype.setY = function (y) {
    if (y < 0) {
        throw new TypeError('Invalid argument');
    }
    this._y = y;
};

Position.prototype.getX = function () {
    return this._x;
};

Position.prototype.getY = function () {
    return this._y;
};
},{}],10:[function(require,module,exports){
"use strict";

module.exports = UndirectedEdge;
var Edge = require('./Edge');

/**
 * Represents a two-way edge
 *
 * @param {Vertex} vertexA
 * @param {Vertex} vertexB
 * @constructor
 */
function UndirectedEdge(vertexA, vertexB) {
    Edge.call(this, vertexA, vertexB);
    this._vertexA = vertexA;
    this._vertexB = vertexB;
    vertexA.addEdge(this);
    vertexB.addEdge(this);
}

UndirectedEdge.prototype = Object.create(Edge.prototype);

/**
 * @param {Vertex} vertex
 * @return {Vertex}
 */
UndirectedEdge.prototype.getIncidentVertexTo = function (vertex) {
    switch (vertex) {
        case this._vertexA: return this._vertexB;
        case this._vertexB: return this._vertexA;
        default: throw new Error('Invalid vertex: ' + vertex);
    }
};
},{"./Edge":5}],11:[function(require,module,exports){
"use strict";

module.exports = Vertex;
var DirectedEdge = require('./DirectedEdge');
var UndirectedEdge = require('./UndirectedEdge');
var Position = require('./Position');

/**
 * Represents a vertex: https://en.wikipedia.org/wiki/Vertex_(graph_theory)
 *
 * @param {string|number} id
 * @param {Position} [position]
 * @constructor
 */
function Vertex(id, position) {
    this._id = id;
    this._edges = [];
    this._position = (position instanceof Position) ? position : null;
}

/**
 * @returns {Position|null}
 */
Vertex.prototype.getPosition = function () {
    return this._position;
};

/**
 * @param {Position} position
 */
Vertex.prototype.setPosition = function (position) {
    this._position = position;
};

/**
 * @return {string|number}
 */
Vertex.prototype.getId = function () {
    return this._id;
};

/**
 * @param {Function} callback
 */
Vertex.prototype.filterEdges = function (callback) {
    this._edges = this._edges.filter(callback);
};

/**
 * @return {Array<Edge>}
 */
Vertex.prototype.getEdges = function () {
    return this._edges;
};

/**
 * @param {Edge} edge
 */
Vertex.prototype.addEdge = function (edge) {
    this._edges.push(edge);
};

/**
 * @param {Vertex} vertex
 * @return {DirectedEdge}
 */
Vertex.prototype.createDirectedEdgeTo = function (vertex) {
    return new DirectedEdge(this, vertex);
};

/**
 * @param {Vertex} vertex
 * @return {UndirectedEdge}
 */
Vertex.prototype.createUndirectedEdgeTo = function (vertex) {
    return new UndirectedEdge(this, vertex);
};

/**
 * @return {Vertex[]}
 */
Vertex.prototype.getIncidentVertices = function () {
    var that = this;
    return this._edges.reduce(function (incidentVertices, edge) {
        if (edge instanceof UndirectedEdge || edge.getFromVertex() === that) {
            return incidentVertices.concat(edge.getIncidentVertexTo(that));
        }
        return incidentVertices;
    }, []);
};

/**
 * @return {number}
 */
Vertex.prototype.getInDegree = function () {
    var that = this;
    return this._edges.reduce(function (inDegree, edge) {
        return (edge instanceof UndirectedEdge || edge.getFromVertex() !== that)
            ? inDegree + 1
            : inDegree;
    }, 0);
};

/**
 * @return {number}
 */
Vertex.prototype.getOutDegree = function () {
    return this.getIncidentVertices().length;
};
},{"./DirectedEdge":4,"./Position":9,"./UndirectedEdge":10}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
"use strict";

module.exports = GraphCanvasView;
var CanvasHelper = require('../CanvasHelper');
var Graph = require('../model/Graph');
var Position = require('../model/Position');

/**
 * @param {Graph} graph
 * @param {HTMLCanvasElement} canvas
 * @constructor
 */
function GraphCanvasView(graph, canvas) {
    this._graph = graph;
    this._canvas = canvas;
    this._canvasHelper = new CanvasHelper(canvas);
    this._dragVertex = null;
    this._uncompletedEdge = null;
    this._selectedVertex = null;
    this._canvas.addEventListener('click', this._onClickListener.bind(this));
    this._canvas.addEventListener('contextmenu', this._onContextMenuListener.bind(this));
    this._canvas.addEventListener('mousemove', this._onMousemoveListener.bind(this));
    this._canvas.addEventListener('mouseup', this._onMouseupListener.bind(this));
    this._canvas.addEventListener('mousedown', this._onMousedownListener.bind(this));
    this._graph.on(Graph.EVENT_VERTEX_CREATED, this._drawVertex.bind(this));
    this._selectedVertexColor = '#0f0';
    this._vertexRadius = 20;
}

/**
 * @param {Vertex} vertex
 */
GraphCanvasView.prototype.setVertexAsSelected = function (vertex) {
    if (!this._graph.containsVertex(vertex)) {
        throw new Error('Attempt to select not added vertex');
    }

    this._selectedVertex = vertex;
    this.redraw();
};

/**
 * @return {Vertex|null}
 */
GraphCanvasView.prototype.getSelectedVertex = function () {
    return this._selectedVertex;
};

GraphCanvasView.prototype.discardSelectedVertex = function () {
    this._selectedVertex = null;
};

/**
 * @param {Position} position
 * @return {Vertex|null}
 * @private
 */
GraphCanvasView.prototype._getVertexByPosition = function (position) {
    var that = this;
    return this._graph.getVerticesList().find(function (vertex) {
        return that._checkPositionIsInCircle(position, vertex.getPosition(), that._vertexRadius);
    });
};

/**
 * @param {Position} position
 * @param {Position} circlePosition
 * @param {number} circleRadius
 * @return {boolean}
 */
GraphCanvasView.prototype._checkPositionIsInCircle = function (position, circlePosition, circleRadius) {
    return Math.pow(position.getX() - circlePosition.getX(), 2)
        + Math.pow(position.getY() - circlePosition.getY(), 2)
        <= Math.pow(circleRadius, 2);
};


GraphCanvasView.prototype.redraw = function () {
    this._canvasHelper.clearCanvas();
    var splittedEdges = this._splitEdgesByVertices(this._graph.getEdgesList());
    var that = this;
    splittedEdges.forEach(function (edges) {
        that._canvasHelper.drawEdges(edges);
    });
    this._graph.getVerticesList().forEach(function (vertex) {
        var color = (vertex === that._selectedVertex) ? that._selectedVertexColor : null;
        that._canvasHelper.drawCircle(vertex.getPosition(), that._vertexRadius, vertex.getId(), color);
    });
};

/**
 * @param {Edge[]} edges
 * @return {Array}
 * @private
 */
GraphCanvasView.prototype._splitEdgesByVertices = function (edges) {
    var hashMap = [];
    edges.forEach(function (edge) {
        var getId = function (vertex) {
            return vertex.getId();
        };
        var hash = edge.getVertices().map(getId).sort().join('');
        if (hashMap[hash]) {
            hashMap[hash].push(edge);
        } else {
            hashMap[hash] = [edge];
        }
    });
    var withoutHash = [];
    for (var i in hashMap) {
        withoutHash.push(hashMap[i]);
    }
    return withoutHash;
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onClickListener = function (event) {
    var clickPosition = this._getEventPosition(event);
    var vertex = this._getVertexByPosition(clickPosition);
    if (!this._dragVertex && !vertex) {
        this._graph.createVertexWithPosition(clickPosition);
    } else if (vertex && this._ctrlKeyIsPressed(event)) {
        this.setVertexAsSelected(vertex);
    }
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onContextMenuListener = function (event) {
    event.preventDefault();
    var clickPosition = this._getEventPosition(event);
    var vertex = this._getVertexByPosition(clickPosition);
    if (this._ctrlKeyIsPressed(event) && vertex) {
        this._graph.deleteVertex(vertex);
    } else if (vertex) {
        if (this._uncompletedEdge) {
            var vertexFrom = this._getVertexByPosition(this._uncompletedEdge);
            if (document.getElementById('directed-edge').checked) {
                this._graph.addEdge(vertexFrom.createDirectedEdgeTo(vertex));
            } else {
                this._graph.addEdge(vertexFrom.createUndirectedEdgeTo(vertex));
            }
            this._uncompletedEdge = null;
            this.redraw();
        } else if (vertex) {
            this._uncompletedEdge = vertex.getPosition();
        }
    } else if (this._uncompletedEdge && !vertex) {
        this._uncompletedEdge = null;
        this.redraw();
    }
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onMousemoveListener = function (event) {
    var mousePosition = this._getEventPosition(event);
    if (this._uncompletedEdge) {
        this.redraw();
        var isEdgeDirected = document.getElementById('directed-edge').checked;
        this._canvasHelper.drawLine(isEdgeDirected, this._uncompletedEdge, mousePosition);
    } else if (this._dragVertex) {
        this._dragVertex.setPosition(mousePosition);
        this.redraw();
    }
};

GraphCanvasView.prototype._onMouseupListener = function () {
    if (this._dragVertex) {
        this._dragVertex = null;
        this.redraw();
    }
};

/**
 * @param {Event} event
 * @private
 */
GraphCanvasView.prototype._onMousedownListener = function (event) {
    var vertex = this._getVertexByPosition(this._getEventPosition(event));
    if (!vertex) {
        return false;
    }
    this._dragVertex = vertex;
};

/**
 * @param {Event} event
 * @return {Position}
 * @private
 */
GraphCanvasView.prototype._getEventPosition = function (event) {
    var boundingClientRect = this._canvas.getBoundingClientRect();
    return new Position(
        parseInt(event.clientX - boundingClientRect.left),
        parseInt(event.clientY - boundingClientRect.top)
    );
};

/**
 * @param {Event} event
 * @return {boolean}
 * @private
 */
GraphCanvasView.prototype._ctrlKeyIsPressed = function (event) {
    return event.ctrlKey || event.metaKey;
};

/**
 * @param {Vertex} vertex
 * @private
 */
GraphCanvasView.prototype._drawVertex = function (vertex) {
    this._canvasHelper.drawCircle(vertex.getPosition(), this._vertexRadius, vertex.getId());
};

/**
 * TODO: delete this
 * @return {CanvasHelper}
 */
GraphCanvasView.prototype.getCanvasHelper = function () {
    return this._canvasHelper;
};

/**
 * @return {number}
 */
GraphCanvasView.prototype.getVertexRadius = function () {
    return this._vertexRadius;
};
},{"../CanvasHelper":1,"../model/Graph":7,"../model/Position":9}],14:[function(require,module,exports){
"use strict";

module.exports = GraphHtmlTableView;
var Graph = require('./../model/Graph');
var DirectedEdge = require('./../model/DirectedEdge');

/**
 * @param {Graph} graph
 * @param {GraphConverter} graphConverter
 * @constructor
 */
function GraphHtmlTableView(graph, graphConverter) {
    this._graph = graph;
    this._graphConverter = graphConverter;
    this._setUpEventListeners();
}

/**
 * @private
 */
GraphHtmlTableView.prototype._setUpEventListeners = function () {
    this._graph.on(Graph.EVENT_VERTEX_CREATED,
        this.rebuildAdjacencyListAction.bind(this),
        this.rebuildAdjacencyMatrixAction.bind(this),
        this.rebuildDegreesTable.bind(this)
    );
    this._graph.on(Graph.EVENT_EDGE_ADDED,
        this.rebuildIncidenceMatrixAction.bind(this),
        this.rebuildAdjacencyListAction.bind(this),
        this.rebuildAdjacencyMatrixAction.bind(this),
        this.rebuildDegreesTable.bind(this)
    );
    this._graph.on(Graph.EVENT_VERTEX_DELETED,
        this.rebuildAdjacencyListAction.bind(this),
        this.rebuildAdjacencyMatrixAction.bind(this),
        this.rebuildIncidenceMatrixAction.bind(this),
        this.rebuildDegreesTable.bind(this)
    );
};

GraphHtmlTableView.prototype.rebuildIncidenceMatrixAction = function () {
    var incidenceMatrix = this._graphConverter.toIncidenceMatrix(this._graph);
    document.getElementById('incidence-matrix-representation')
        .innerHTML = this._incidenceMatrixToHtmlTable(incidenceMatrix);
};

GraphHtmlTableView.prototype.rebuildAdjacencyMatrixAction = function () {
    var adjacencyMatrix = this._graphConverter.toAdjacencyMatrix(this._graph);
    document.getElementById('adjacency-matrix-representation')
        .innerHTML = this._adjacencyMatrixToHtmlTable(adjacencyMatrix, this._graph.getVerticesList());
};

GraphHtmlTableView.prototype.rebuildAdjacencyListAction = function () {
    document.getElementById('adjacency-list-representation')
        .innerHTML = this._buildAdjacencyListHtml(this._graph.getVerticesList());
};

GraphHtmlTableView.prototype.rebuildDegreesTable = function () {
    document.getElementById('degrees-representation')
        .innerHTML = this._buildDegreesTable(this._graph);
};

/**
 * @param {Vertex[]} verticesList
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._buildAdjacencyListHtml = function (verticesList) {
    if (!verticesList.length) {
        return '';
    }
    var separator = ', ',
        resultHtml = "<table><tr><th>Vertex</th><th>Adjacent vertices</th></tr>";
    verticesList.forEach(function (vertex) {
        resultHtml += "<tr><td>"
            + vertex.getId()
            + "</td><td>"
            + vertex.getIncidentVertices().map(function (vertex) {
                return vertex.getId();
            }).join(separator)
            + "</td></tr>";
    });
    return resultHtml + "</table>";
};


/**
 * @param {Array} adjacencyMatrix
 * @param {Array<Vertex>} verticesList
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._adjacencyMatrixToHtmlTable = function (adjacencyMatrix, verticesList) {
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
};

/**
 * @param {Array} incidenceMatrix
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._incidenceMatrixToHtmlTable = function (incidenceMatrix) {
    if (!incidenceMatrix.length || incidenceMatrix.every(function (row) {
            return row.length === 0
        })) {
        return '';
    }
    var resultHtml = "<table><tr><th colspan='100%'>Incidence Matrix</th></tr>";
    resultHtml += incidenceMatrix.map(function (row) {
        return "<tr>" + row.map(function (el) {
                return "<td>" + el + "</td>";
            }).join('') + "</tr>";
    }).join('');
    return resultHtml + "</table>";
};

/**
 * @param {Graph} graph
 * @return {string}
 * @private
 */
GraphHtmlTableView.prototype._buildDegreesTable = function (graph) {
    var result = "<table><tr><th></th><th>inDegree</th><th>outDegree</th></tr>";
    graph.getVerticesList().forEach(function (vertex) {
        result += "<tr>";
        result += "<td>" + vertex.getId() + "</td>";
        result += "<td>" + vertex.getInDegree() + "</td>";
        result += "<td>" + vertex.getOutDegree() + "</td>";
        result += "</tr>";
    });
    return result + "</table>";
};
},{"./../model/DirectedEdge":4,"./../model/Graph":7}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FudmFzSGVscGVyLmpzIiwic3JjL1ZlcnRpY2VzVHJhdmVyc2luZ0FuaW1hdGlvbi5qcyIsInNyYy9hcHAuanMiLCJzcmMvbW9kZWwvRGlyZWN0ZWRFZGdlLmpzIiwic3JjL21vZGVsL0VkZ2UuanMiLCJzcmMvbW9kZWwvRXZlbnRNYW5hZ2VyTWl4aW4uanMiLCJzcmMvbW9kZWwvR3JhcGguanMiLCJzcmMvbW9kZWwvR3JhcGhDb252ZXJ0ZXIuanMiLCJzcmMvbW9kZWwvUG9zaXRpb24uanMiLCJzcmMvbW9kZWwvVW5kaXJlY3RlZEVkZ2UuanMiLCJzcmMvbW9kZWwvVmVydGV4LmpzIiwic3JjL21vZGVsL3RyYXZlcnNpbmctYWxnb3JpdGhtcy5qcyIsInNyYy92aWV3L0dyYXBoQ2FudmFzVmlldy5qcyIsInNyYy92aWV3L0dyYXBoSHRtbFRhYmxlVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhc0hlbHBlcjtcbnZhciBQb3NpdGlvbiA9IHJlcXVpcmUoJy4vbW9kZWwvUG9zaXRpb24nKTtcbnZhciBEaXJlY3RlZEVkZ2UgPSByZXF1aXJlKCcuL21vZGVsL0RpcmVjdGVkRWRnZScpO1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIENhbnZhc0hlbHBlcihjYW52YXMpIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5fd2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcbiAgICB0aGlzLl9mb250U2l6ZSA9IDEzO1xuICAgIHRoaXMuX3JhdGlvID0gMC41O1xuICAgIHRoaXMuX2Fycm93TGVuZ3RoID0gMjA7XG59XG5cbkNhbnZhc0hlbHBlci5wcm90b3R5cGUuY2xlYXJDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNEaXJlY3RlZFxuICogQHBhcmFtIHtQb3NpdGlvbn0gZnJvbVBvc2l0aW9uXG4gKiBAcGFyYW0ge1Bvc2l0aW9ufSB0b1Bvc2l0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gW2xpbmVXaWR0aF1cbiAqIEBwYXJhbSB7Kn0gW3N0cm9rZVN0eWxlXVxuICovXG5DYW52YXNIZWxwZXIucHJvdG90eXBlLmRyYXdMaW5lID0gZnVuY3Rpb24gKGlzRGlyZWN0ZWQsIGZyb21Qb3NpdGlvbiwgdG9Qb3NpdGlvbiwgbGluZVdpZHRoLCBzdHJva2VTdHlsZSkge1xuICAgIGlmIChsaW5lV2lkdGgpIHtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxpbmVXaWR0aCkgfHwgbGluZVdpZHRoIDwgMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGluZVdpZHRoIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBnaXZlbjogJyArIGxpbmVXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29udGV4dC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgfVxuICAgIGlmIChzdHJva2VTdHlsZSkge1xuICAgICAgICB0aGlzLl9jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLl9jb250ZXh0Lm1vdmVUbyhmcm9tUG9zaXRpb24uZ2V0WCgpLCBmcm9tUG9zaXRpb24uZ2V0WSgpKTtcbiAgICB0aGlzLl9jb250ZXh0LmxpbmVUbyh0b1Bvc2l0aW9uLmdldFgoKSwgdG9Qb3NpdGlvbi5nZXRZKCkpO1xuICAgIHRoaXMuX2NvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICBpZiAoaXNEaXJlY3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl9jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB2YXIgcG9zaXRpb25EaXZJblJhdGlvID0gdGhpcy5fZ2V0UG9zaXRpb25EaXZpZGVkSW5SYXRpbyh0aGlzLl9yYXRpbywgZnJvbVBvc2l0aW9uLCB0b1Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5fZHJhd0Fycm93KGZyb21Qb3NpdGlvbiwgdG9Qb3NpdGlvbiwgcG9zaXRpb25EaXZJblJhdGlvKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgcG9zaXRpb24gb2YgdGhlIHBvaW50LCB0aGF0IGRpdmlkZXMgdGhlIGxpbmUgaW4gYSBnaXZlbiByYXRpb1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSByYXRpb1xuICogQHBhcmFtIHtQb3NpdGlvbn0gZnJvbVBvc2l0aW9uXG4gKiBAcGFyYW0ge1Bvc2l0aW9ufSB0b1Bvc2l0aW9uXG4gKiBAcmV0dXJuIHtQb3NpdGlvbn1cbiAqIEBwcml2YXRlXG4gKi9cbkNhbnZhc0hlbHBlci5wcm90b3R5cGUuX2dldFBvc2l0aW9uRGl2aWRlZEluUmF0aW8gPSBmdW5jdGlvbiAocmF0aW8sIGZyb21Qb3NpdGlvbiwgdG9Qb3NpdGlvbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oXG4gICAgICAgIChmcm9tUG9zaXRpb24uZ2V0WCgpICsgKHJhdGlvICogdG9Qb3NpdGlvbi5nZXRYKCkpKSAvICgxICsgcmF0aW8pLFxuICAgICAgICAoZnJvbVBvc2l0aW9uLmdldFkoKSArIChyYXRpbyAqIHRvUG9zaXRpb24uZ2V0WSgpKSkgLyAoMSArIHJhdGlvKVxuICAgICk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7UG9zaXRpb259IHBvc2l0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzXG4gKiBAcGFyYW0geyp9IHRleHRJbnNpZGVcbiAqIEBwYXJhbSB7Kn0gW2NvbG9yXVxuICovXG5DYW52YXNIZWxwZXIucHJvdG90eXBlLmRyYXdDaXJjbGUgPSBmdW5jdGlvbiAocG9zaXRpb24sIHJhZGl1cywgdGV4dEluc2lkZSwgY29sb3IpIHtcbiAgICB0aGlzLl9jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuX2NvbnRleHQuYXJjKHBvc2l0aW9uLmdldFgoKSwgcG9zaXRpb24uZ2V0WSgpLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbiAgICB0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yIHx8IFwiIzAwZlwiO1xuICAgIHRoaXMuX2NvbnRleHQuZmlsbCgpO1xuXG4gICAgdGhpcy5fY29udGV4dC5mb250ID0gdGhpcy5fZm9udFNpemUgKyAncHQgQXJpYWwnO1xuICAgIHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIHRoaXMuX2NvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgdGhpcy5fY29udGV4dC5maWxsVGV4dCh0ZXh0SW5zaWRlLCBwb3NpdGlvbi5nZXRYKCksIHBvc2l0aW9uLmdldFkoKSArIHRoaXMuX2ZvbnRTaXplIC8gMik7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RWRnZVtdfSBlZGdlc1xuICovXG5DYW52YXNIZWxwZXIucHJvdG90eXBlLmRyYXdFZGdlcyA9IGZ1bmN0aW9uIChlZGdlcykge1xuICAgIHZhciBnZW5lcmF0ZVNoaWZ0ID0gdGhpcy5fZ2V0U2hpZnRHZW5lcmF0b3IoZWRnZXMubGVuZ3RoKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgZWRnZXMuZm9yRWFjaChmdW5jdGlvbiAoZWRnZSkge1xuICAgICAgICB2YXIgdmVydGljZXMgPSBlZGdlLmdldFZlcnRpY2VzKCksXG4gICAgICAgICAgICBmcm9tWCA9IHZlcnRpY2VzWzBdLmdldFBvc2l0aW9uKCkuZ2V0WCgpLFxuICAgICAgICAgICAgZnJvbVkgPSB2ZXJ0aWNlc1swXS5nZXRQb3NpdGlvbigpLmdldFkoKSxcbiAgICAgICAgICAgIHRvWCA9IHZlcnRpY2VzWzFdLmdldFBvc2l0aW9uKCkuZ2V0WCgpLFxuICAgICAgICAgICAgdG9ZID0gdmVydGljZXNbMV0uZ2V0UG9zaXRpb24oKS5nZXRZKCk7XG5cbiAgICAgICAgdGhhdC5fY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhhdC5fY29udGV4dC5tb3ZlVG8oZnJvbVgsIGZyb21ZKTtcbiAgICAgICAgdmFyIHNoaWZ0WCA9IChmcm9tWCArIHRvWCkgLyAyO1xuICAgICAgICB2YXIgc2hpZnRZID0gKGZyb21ZICsgdG9ZKSAvIDI7XG4gICAgICAgIHNoaWZ0WSArPSBnZW5lcmF0ZVNoaWZ0KCk7XG4gICAgICAgIHRoYXQuX2NvbnRleHQucXVhZHJhdGljQ3VydmVUbyhzaGlmdFgsIHNoaWZ0WSwgdG9YLCB0b1kpO1xuICAgICAgICB0aGF0Ll9jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICBpZiAoZWRnZSBpbnN0YW5jZW9mIERpcmVjdGVkRWRnZSkge1xuICAgICAgICAgICAgdGhhdC5fY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIHZhciBhcnJvd1N0YXJ0UG9zaXRpb24gPSBuZXcgUG9zaXRpb24oXG4gICAgICAgICAgICAgICAgdGhhdC5fZ2V0UXVhZHJhdGljQ3VydmVDb29yZCh0aGF0Ll9yYXRpbywgZnJvbVgsIHNoaWZ0WCwgdG9YKSxcbiAgICAgICAgICAgICAgICB0aGF0Ll9nZXRRdWFkcmF0aWNDdXJ2ZUNvb3JkKHRoYXQuX3JhdGlvLCBmcm9tWSwgc2hpZnRZLCB0b1kpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhhdC5fZHJhd0Fycm93KHZlcnRpY2VzWzBdLmdldFBvc2l0aW9uKCksIHZlcnRpY2VzWzFdLmdldFBvc2l0aW9uKCksIGFycm93U3RhcnRQb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogaHR0cHM6Ly9ydS53aWtpcGVkaWEub3JnL3dpa2kvJUQwJTlBJUQxJTgwJUQwJUI4JUQwJUIyJUQwJUIwJUQxJThGXyVEMCU5MSVEMCVCNSVEMCVCNyVEMSU4QyVEMCVCNSMuRDAuOUEuRDAuQjIuRDAuQjAuRDAuQjQuRDEuODAuRDAuQjAuRDEuODIuRDAuQjguRDEuODcuRDAuQkQuRDEuOEIuRDAuQjVfLkQwLkJBLkQxLjgwLkQwLkI4LkQwLkIyLkQxLjhCLkQwLkI1XG4gKiBAcGFyYW0ge251bWJlcn0gdFxuICogQHBhcmFtIHtudW1iZXJ9IHAwXG4gKiBAcGFyYW0ge251bWJlcn0gcDFcbiAqIEBwYXJhbSB7bnVtYmVyfSBwMlxuICogQHJldHVybiB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xuQ2FudmFzSGVscGVyLnByb3RvdHlwZS5fZ2V0UXVhZHJhdGljQ3VydmVDb29yZCA9IGZ1bmN0aW9uICh0LCBwMCwgcDEsIHAyKSB7XG4gICAgaWYgKHQgPCAwIHx8IHQgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIHQgbXVzdCBiZSBpbiByYW5nZSBmcm9tIDAgdG8gMScpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5wb3coMSAtIHQsIDIpICogcDAgKyAyICogKDEgLSB0KSAqIHQgKiBwMSArIE1hdGgucG93KHQsIDIpICogcDI7XG59O1xuXG5cbi8qKlxuICogaHR0cHM6Ly9ydS53aWtpcGVkaWEub3JnL3dpa2kvJUQwJTlGJUQwJUJFJUQwJUIyJUQwJUJFJUQxJTgwJUQwJUJFJUQxJTgyIy5EMC45Ri5EMC5CRS5EMC5CMi5EMC5CRS5EMS44MC5EMC5CRS5EMS44Ml8uRDAuQjJfLkQwLkI0LkQwLkIyLkQxLjgzLkQwLkJDLkQwLkI1LkQxLjgwLkQwLkJELkQwLkJFLkQwLkJDXy5EMC5CRi5EMS44MC5EMC5CRS5EMS44MS5EMS44Mi5EMS44MC5EMC5CMC5EMC5CRC5EMS44MS5EMS44Mi5EMC5CMi5EMC5CNVxuICogQHBhcmFtIHtQb3NpdGlvbn0gZnJvbVBvc2l0aW9uXG4gKiBAcGFyYW0ge1Bvc2l0aW9ufSB0b1Bvc2l0aW9uXG4gKiBAcGFyYW0ge1Bvc2l0aW9ufSBhcnJvd1N0YXJ0UG9zaXRpb25cbiAqIEBwcml2YXRlXG4gKi9cbkNhbnZhc0hlbHBlci5wcm90b3R5cGUuX2RyYXdBcnJvdyA9IGZ1bmN0aW9uIChmcm9tUG9zaXRpb24sIHRvUG9zaXRpb24sIGFycm93U3RhcnRQb3NpdGlvbikge1xuICAgIHZhciBmcm9tWCA9IGZyb21Qb3NpdGlvbi5nZXRYKCk7XG4gICAgdmFyIGZyb21ZID0gZnJvbVBvc2l0aW9uLmdldFkoKTtcbiAgICB2YXIgdG9YID0gdG9Qb3NpdGlvbi5nZXRYKCk7XG4gICAgdmFyIHRvWSA9IHRvUG9zaXRpb24uZ2V0WSgpO1xuXG4gICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMih0b1kgLSBmcm9tWSwgdG9YIC0gZnJvbVgpO1xuICAgIHZhciByb3RhdGlvbkFuZ2xlID0gTWF0aC5QSSAvIDY7XG5cbiAgICB2YXIgeCA9IGFycm93U3RhcnRQb3NpdGlvbi5nZXRYKCk7XG4gICAgdmFyIHkgPSBhcnJvd1N0YXJ0UG9zaXRpb24uZ2V0WSgpO1xuXG4gICAgdGhpcy5fY29udGV4dC5tb3ZlVG8oeCwgeSk7XG4gICAgdGhpcy5fY29udGV4dC5saW5lVG8oXG4gICAgICAgIHggLSB0aGlzLl9hcnJvd0xlbmd0aCAqIE1hdGguY29zKGFuZ2xlIC0gcm90YXRpb25BbmdsZSksXG4gICAgICAgIHkgLSB0aGlzLl9hcnJvd0xlbmd0aCAqIE1hdGguc2luKGFuZ2xlIC0gcm90YXRpb25BbmdsZSlcbiAgICApO1xuICAgIHRoaXMuX2NvbnRleHQubW92ZVRvKHgsIHkpO1xuICAgIHRoaXMuX2NvbnRleHQubGluZVRvKFxuICAgICAgICB4IC0gdGhpcy5fYXJyb3dMZW5ndGggKiBNYXRoLmNvcyhhbmdsZSArIHJvdGF0aW9uQW5nbGUpLFxuICAgICAgICB5IC0gdGhpcy5fYXJyb3dMZW5ndGggKiBNYXRoLnNpbihhbmdsZSArIHJvdGF0aW9uQW5nbGUpXG4gICAgKTtcbiAgICB0aGlzLl9jb250ZXh0LnN0cm9rZSgpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gZWRnZXNDb3VudFxuICogQHJldHVybiB7RnVuY3Rpb259IC0gQ2FsbGJhY2sgdGhhdCBnZW5lcmF0ZXMgc2hpZnQgZm9yIHRoZSBuZXh0IHBhcmFsbGVsIGVkZ2VcbiAqIEBwcml2YXRlXG4gKi9cbkNhbnZhc0hlbHBlci5wcm90b3R5cGUuX2dldFNoaWZ0R2VuZXJhdG9yID0gZnVuY3Rpb24gKGVkZ2VzQ291bnQpIHtcbiAgICBpZiAoZWRnZXNDb3VudCA8IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFZGdlcyBjb3VudCBtdXN0IGJlIHBvc2l0aXZlJyk7XG4gICAgfVxuICAgIHZhciBkaXN0YW5jZUJldHdlZW5FZGdlcyA9IDUwO1xuICAgIHZhciBzaGlmdCA9IChlZGdlc0NvdW50ICUgMiA9PT0gMCkgPyBkaXN0YW5jZUJldHdlZW5FZGdlcyA6IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9sZFNoaWZ0ID0gc2hpZnQ7XG4gICAgICAgIGlmIChzaGlmdCA+IDApIHtcbiAgICAgICAgICAgIHNoaWZ0ICo9IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hpZnQgPSBNYXRoLmFicyhzaGlmdCkgKyBkaXN0YW5jZUJldHdlZW5FZGdlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2xkU2hpZnQ7XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBWZXJ0aWNlc1RyYXZlcnNpbmdBbmltYXRpb247XG52YXIgRXZlbnRNYW5hZ2VyTWl4aW4gPSByZXF1aXJlKCcuL21vZGVsL0V2ZW50TWFuYWdlck1peGluJyk7XG52YXIgYnJlYWRGaXJzdFNlYXJjaCA9IHJlcXVpcmUoJy4vbW9kZWwvdHJhdmVyc2luZy1hbGdvcml0aG1zJykuYmZzO1xudmFyIGRlcHRoRmlyc3RTZWFyY2ggPSByZXF1aXJlKCcuL21vZGVsL3RyYXZlcnNpbmctYWxnb3JpdGhtcycpLmRmcztcblxuLyoqXG4gKiBAcGFyYW0ge0dyYXBoQ2FudmFzVmlld30gZ3JhcGhDYW52YXNWaWV3XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFuaW1hdGlvblN0YXJ0QnV0dG9uXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGRmc0J1dHRvblxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFZlcnRpY2VzVHJhdmVyc2luZ0FuaW1hdGlvbihncmFwaENhbnZhc1ZpZXcsIGFuaW1hdGlvblN0YXJ0QnV0dG9uLCBkZnNCdXR0b24pIHtcbiAgICBFdmVudE1hbmFnZXJNaXhpbi5jYWxsKHRoaXMpO1xuICAgIHRoaXMuX2dyYXBoQ2FudmFzVmlldyA9IGdyYXBoQ2FudmFzVmlldztcbiAgICB0aGlzLl9jYW52YXNIZWxwZXIgPSBncmFwaENhbnZhc1ZpZXcuZ2V0Q2FudmFzSGVscGVyKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhcnRCdXR0b24gPSBhbmltYXRpb25TdGFydEJ1dHRvbjtcbiAgICB0aGlzLl92ZXJ0ZXhWaXNpdERlbGF5ID0gNTAwO1xuICAgIHRoaXMuX3Zpc2l0ZWRWZXJ0ZXhDb2xvciA9IFwiI2YwMFwiO1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdHJhdmVyc2luZ0FsZ28gPSAoZGZzQnV0dG9uLmNoZWNrZWQpID8gZGVwdGhGaXJzdFNlYXJjaCA6IGJyZWFkRmlyc3RTZWFyY2g7XG4gICAgICAgIHRoaXMuc3RhcnRBbmltYXRpb24odHJhdmVyc2luZ0FsZ28pO1xuICAgIH0uYmluZCh0aGlzKSk7XG59XG5cblZlcnRpY2VzVHJhdmVyc2luZ0FuaW1hdGlvbi5FVkVOVF9WRVJURVhfVklTSVRFRCA9ICd2ZXJ0ZXhWaXNpdGVkJztcblxuLyoqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmF2ZXJzaW5nQWxnb1xuICogQHByaXZhdGVcbiAqL1xuVmVydGljZXNUcmF2ZXJzaW5nQW5pbWF0aW9uLnByb3RvdHlwZS5zdGFydEFuaW1hdGlvbiA9IGZ1bmN0aW9uICh0cmF2ZXJzaW5nQWxnbykge1xuICAgIHZhciBzdGFydEZyb21WZXJ0ZXggPSB0aGlzLl9ncmFwaENhbnZhc1ZpZXcuZ2V0U2VsZWN0ZWRWZXJ0ZXgoKTtcbiAgICBpZiAoIXN0YXJ0RnJvbVZlcnRleCkge1xuICAgICAgICByZXR1cm4gYWxlcnQoJ1NlbGVjdCBzdGFydCB2ZXJ0ZXggdXNpbmcgQ3RybCArIGxlZnQgbW91c2UgY2xpY2snKTtcbiAgICB9XG4gICAgdmFyIHZpc2l0ZWRWZXJ0aWNlcyA9IHRyYXZlcnNpbmdBbGdvKHN0YXJ0RnJvbVZlcnRleCk7XG4gICAgdGhpcy5fYW5pbWF0ZVZpc2l0ZWQodmlzaXRlZFZlcnRpY2VzKTtcbiAgICB0aGlzLl9ncmFwaENhbnZhc1ZpZXcuZGlzY2FyZFNlbGVjdGVkVmVydGV4KCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7VmVydGV4W119IHZpc2l0ZWRWZXJ0aWNlc1xuICogQHByaXZhdGVcbiAqL1xuVmVydGljZXNUcmF2ZXJzaW5nQW5pbWF0aW9uLnByb3RvdHlwZS5fYW5pbWF0ZVZpc2l0ZWQgPSBmdW5jdGlvbiAodmlzaXRlZFZlcnRpY2VzKSB7XG4gICAgdmFyIGN1cnJlbnRWZXJ0ZXggPSB2aXNpdGVkVmVydGljZXMuc2hpZnQoKTtcbiAgICBpZiAoY3VycmVudFZlcnRleCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoVmVydGljZXNUcmF2ZXJzaW5nQW5pbWF0aW9uLkVWRU5UX1ZFUlRFWF9WSVNJVEVEKTtcbiAgICAgICAgdGhpcy5fY2FudmFzSGVscGVyLmRyYXdDaXJjbGUoXG4gICAgICAgICAgICBjdXJyZW50VmVydGV4LmdldFBvc2l0aW9uKCksXG4gICAgICAgICAgICB0aGlzLl9ncmFwaENhbnZhc1ZpZXcuZ2V0VmVydGV4UmFkaXVzKCkgKyAxMCxcbiAgICAgICAgICAgIGN1cnJlbnRWZXJ0ZXguZ2V0SWQoKSxcbiAgICAgICAgICAgIHRoaXMuX3Zpc2l0ZWRWZXJ0ZXhDb2xvclxuICAgICAgICApO1xuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuX2FuaW1hdGVWaXNpdGVkLmJpbmQodGhpcywgdmlzaXRlZFZlcnRpY2VzKSwgdGhpcy5fdmVydGV4VmlzaXREZWxheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoJ0FuaW1hdGlvbiBjb21wbGV0ZWQnKTtcbiAgICB9XG59OyIsInZhciBHcmFwaCA9IHJlcXVpcmUoJy4vbW9kZWwvR3JhcGgnKTtcbnZhciBHcmFwaENhbnZhc1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvR3JhcGhDYW52YXNWaWV3Jyk7XG52YXIgR3JhcGhIdG1sVGFibGVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0dyYXBoSHRtbFRhYmxlVmlldycpO1xudmFyIFZlcnRpY2VzVHJhdmVyc2luZ0FuaW1hdGlvbiA9IHJlcXVpcmUoJy4vVmVydGljZXNUcmF2ZXJzaW5nQW5pbWF0aW9uJyk7XG52YXIgR3JhcGhDb252ZXJ0ZXIgPSByZXF1aXJlKCcuL21vZGVsL0dyYXBoQ29udmVydGVyJyk7XG5cbnZhciBncmFwaCA9IG5ldyBHcmFwaCgpO1xudmFyIGdyYXBoSHRtbFRhYmxlVmlldyA9IG5ldyBHcmFwaEh0bWxUYWJsZVZpZXcoZ3JhcGgsIG5ldyBHcmFwaENvbnZlcnRlcigpKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdyYXBoQ2FudmFzVmlldyA9IG5ldyBHcmFwaENhbnZhc1ZpZXcoZ3JhcGgsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSk7XG4gICAgdmFyIHZlcnRpY2VzVHJhdmVyc2luZ0FuaW1hdGlvbiA9IG5ldyBWZXJ0aWNlc1RyYXZlcnNpbmdBbmltYXRpb24oXG4gICAgICAgIGdyYXBoQ2FudmFzVmlldyxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0LXNlYXJjaCcpLFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVwdGgtZmlyc3Qtc2VhcmNoJylcbiAgICApO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0ZWRFZGdlO1xudmFyIEVkZ2UgPSByZXF1aXJlKCcuL0VkZ2UnKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgb25lLXdheSBlZGdlXG4gKlxuICogQHBhcmFtIHtWZXJ0ZXh9IGZyb21WZXJ0ZXhcbiAqIEBwYXJhbSB7VmVydGV4fSB0b1ZlcnRleFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIERpcmVjdGVkRWRnZShmcm9tVmVydGV4LCB0b1ZlcnRleCkge1xuICAgIEVkZ2UuY2FsbCh0aGlzLCBmcm9tVmVydGV4LCB0b1ZlcnRleCk7XG4gICAgdGhpcy5fZnJvbVZlcnRleCA9IGZyb21WZXJ0ZXg7XG4gICAgdGhpcy5fdG9WZXJ0ZXggPSB0b1ZlcnRleDtcbiAgICBmcm9tVmVydGV4LmFkZEVkZ2UodGhpcyk7XG4gICAgdG9WZXJ0ZXguYWRkRWRnZSh0aGlzKTtcbn1cblxuRGlyZWN0ZWRFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRWRnZS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEByZXR1cm4ge1ZlcnRleH1cbiAqL1xuRGlyZWN0ZWRFZGdlLnByb3RvdHlwZS5nZXRGcm9tVmVydGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9mcm9tVmVydGV4O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4XG4gKiBAcmV0dXJuIHtWZXJ0ZXh9XG4gKi9cbkRpcmVjdGVkRWRnZS5wcm90b3R5cGUuZ2V0SW5jaWRlbnRWZXJ0ZXhUbyA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICBzd2l0Y2ggKHZlcnRleCkge1xuICAgICAgICBjYXNlIHRoaXMuX2Zyb21WZXJ0ZXg6IHJldHVybiB0aGlzLl90b1ZlcnRleDtcbiAgICAgICAgY2FzZSB0aGlzLl90b1ZlcnRleDogcmV0dXJuIHRoaXMuX2Zyb21WZXJ0ZXg7XG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2ZXJ0ZXg6ICcgKyB2ZXJ0ZXgpXG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGdlO1xudmFyIFZlcnRleCA9IHJlcXVpcmUoJy4vVmVydGV4Jyk7XG5cbi8qKlxuICogQWJzdHJhY3QgZWRnZVxuICogXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4QVxuICogQHBhcmFtIHtWZXJ0ZXh9IHZlcnRleEJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBFZGdlKHZlcnRleEEsIHZlcnRleEIpIHtcbiAgICB0aGlzLl92ZXJ0aWNlcyA9IFt2ZXJ0ZXhBLCB2ZXJ0ZXhCXTtcbn1cblxuLyoqXG4gKiBAcmV0dXJuIHtWZXJ0ZXhbXX1cbiAqL1xuRWRnZS5wcm90b3R5cGUuZ2V0VmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2VzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5FZGdlLnByb3RvdHlwZS5jb250YWluc1ZlcnRleCA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGljZXMuaW5kZXhPZih2ZXJ0ZXgpICE9PSAtMTtcbn07XG5cbkVkZ2UucHJvdG90eXBlLmdldEluY2lkZW50VmVydGV4VG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgZGVjbGFyZWQgYXMgYWJzdHJhY3QgYW5kIG11c3QgYmUgb3ZlcnJpZGRlbicpO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE1hbmFnZXJNaXhpbjtcblxuLyoqXG4gKiBTaW1wbGUgbWl4aW4gZm9yIG1hbmFnaW5nIGV2ZW50c1xuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBFdmVudE1hbmFnZXJNaXhpbigpIHtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzID0ge307XG4gICAgXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsqfSBldmVudE5hbWVcbiAgICAgKi9cbiAgICB0aGlzLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICB2YXIgaGFuZGxlcnMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGlmICghdGhpcy5fZXZlbnRIYW5kbGVyc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoYXQuX2V2ZW50SGFuZGxlcnNbZXZlbnROYW1lXS5wdXNoKGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsqfSBldmVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYW5kbGVyQXJndW1lbnRzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBoYW5kbGVyQXJndW1lbnRzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcbnZhciBFdmVudE1hbmFnZXJNaXhpbiA9IHJlcXVpcmUoJy4vRXZlbnRNYW5hZ2VyTWl4aW4nKTtcbnZhciBFZGdlID0gcmVxdWlyZSgnLi9FZGdlJyk7XG52YXIgVmVydGV4ID0gcmVxdWlyZSgnLi9WZXJ0ZXgnKTtcblxuLyoqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZ2VuZXJhdGVWZXJ0ZXhJZF1cbiAqIEBwYXJhbSB7VmVydGV4W119IFt2ZXJ0aWNlc0xpc3RdXG4gKiBAcGFyYW0ge0VkZ2VbXX0gW2VkZ2VzTGlzdF1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBHcmFwaChnZW5lcmF0ZVZlcnRleElkLCB2ZXJ0aWNlc0xpc3QsIGVkZ2VzTGlzdCkge1xuICAgIEV2ZW50TWFuYWdlck1peGluLmNhbGwodGhpcyk7XG4gICAgdGhpcy5fZ2VuZXJhdGVWZXJ0ZXhJZCA9IGdlbmVyYXRlVmVydGV4SWQgfHwgdGhpcy5fZ2V0VmVydGV4SWRHZW5lcmF0b3IoKTtcbiAgICB0aGlzLl9lZGdlc0xpc3QgPSBlZGdlc0xpc3QgfHwgW107XG4gICAgdGhpcy5fdmVydGljZXNMaXN0ID0gdmVydGljZXNMaXN0IHx8IFtdO1xufVxuXG5HcmFwaC5FVkVOVF9WRVJURVhfQ1JFQVRFRCA9ICd2ZXJ0ZXhDcmVhdGVkJztcbkdyYXBoLkVWRU5UX1ZFUlRFWF9ERUxFVEVEID0gJ3ZlcnRleERlbGV0ZWQnO1xuR3JhcGguRVZFTlRfRURHRV9BRERFRCA9ICdlZGdlQWRkZWQnO1xuXG4vKipcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbkdyYXBoLnByb3RvdHlwZS5jb250YWluc1ZlcnRleCA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGljZXNMaXN0LmluZGV4T2YodmVydGV4KSAhPT0gLTE7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RWRnZX0gZWRnZVxuICovXG5HcmFwaC5wcm90b3R5cGUuYWRkRWRnZSA9IGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgdGhpcy5fZWRnZXNMaXN0LnB1c2goZWRnZSk7XG4gICAgdGhpcy50cmlnZ2VyKEdyYXBoLkVWRU5UX0VER0VfQURERUQpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1Bvc2l0aW9ufSBwb3NpdGlvblxuICogQHJldHVybiB7VmVydGV4fVxuICovXG5HcmFwaC5wcm90b3R5cGUuY3JlYXRlVmVydGV4V2l0aFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdmFyIHZlcnRleCA9IG5ldyBWZXJ0ZXgodGhpcy5fZ2VuZXJhdGVWZXJ0ZXhJZCgpLCBwb3NpdGlvbik7XG4gICAgdGhpcy5fdmVydGljZXNMaXN0LnB1c2godmVydGV4KTtcbiAgICB0aGlzLnRyaWdnZXIoR3JhcGguRVZFTlRfVkVSVEVYX0NSRUFURUQsIHZlcnRleCk7XG4gICAgcmV0dXJuIHZlcnRleDtcbn07XG5cbi8qKlxuICogQHJldHVybiB7VmVydGV4W119XG4gKi9cbkdyYXBoLnByb3RvdHlwZS5nZXRWZXJ0aWNlc0xpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2VzTGlzdDtcbn07XG5cbi8qKlxuICogQHJldHVybiB7RWRnZVtdfVxuICovXG5HcmFwaC5wcm90b3R5cGUuZ2V0RWRnZXNMaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGdlc0xpc3Q7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhcbiAqL1xuR3JhcGgucHJvdG90eXBlLmRlbGV0ZVZlcnRleCA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICBpZiAoISh2ZXJ0ZXggaW5zdGFuY2VvZiBWZXJ0ZXgpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBWZXJ0ZXgnKTtcbiAgICB9XG5cbiAgICB2YXIgZG9lc05vdENvbnRhaW5WZXJ0ZXggPSBmdW5jdGlvbiAoZWRnZSkge1xuICAgICAgICByZXR1cm4gIWVkZ2UuY29udGFpbnNWZXJ0ZXgodmVydGV4KTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdmVydGljZXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjdXJyZW50VmVydGV4ID0gdGhpcy5fdmVydGljZXNMaXN0W2ldO1xuICAgICAgICBjdXJyZW50VmVydGV4LmZpbHRlckVkZ2VzKGRvZXNOb3RDb250YWluVmVydGV4KTtcbiAgICAgICAgaWYgKGN1cnJlbnRWZXJ0ZXggPT09IHZlcnRleCkge1xuICAgICAgICAgICAgdGhpcy5fdmVydGljZXNMaXN0LnNwbGljZShpLS0sIDEpO1xuICAgICAgICAgICAgdGhpcy5fZWRnZXNMaXN0ID0gdGhpcy5fZWRnZXNMaXN0LmZpbHRlcihkb2VzTm90Q29udGFpblZlcnRleCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy50cmlnZ2VyKEdyYXBoLkVWRU5UX1ZFUlRFWF9ERUxFVEVEKTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaC5wcm90b3R5cGUuX2dldFZlcnRleElkR2VuZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gNjU7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY3VycmVudCsrKTtcbiAgICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoQ29udmVydGVyO1xudmFyIERpcmVjdGVkRWRnZSA9IHJlcXVpcmUoJy4vRGlyZWN0ZWRFZGdlJyk7XG5cbmZ1bmN0aW9uIEdyYXBoQ29udmVydGVyKCkge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy50b0FkamFjZW5jeU1hdHJpeCA9IGZ1bmN0aW9uIChncmFwaCkge1xuICAgICAgICB2YXIgdmVydGljZXMgPSBncmFwaC5nZXRWZXJ0aWNlc0xpc3QoKTtcblxuICAgICAgICByZXR1cm4gdmVydGljZXMubWFwKGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJ0aWNlcy5tYXAoZnVuY3Rpb24gKHZlcnRleEluUm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZlcnRleC5nZXRJbmNpZGVudFZlcnRpY2VzKCkuZmlsdGVyKGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZlcnRleCA9PT0gdmVydGV4SW5Sb3c7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0dyYXBofSBncmFwaFxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMudG9JbmNpZGVuY2VNYXRyaXggPSBmdW5jdGlvbiAoZ3JhcGgpIHtcbiAgICAgICAgdmFyIGVkZ2VzID0gZ3JhcGguZ2V0RWRnZXNMaXN0KCk7XG4gICAgICAgIHZhciB2ZXJ0aWNlcyA9IGdyYXBoLmdldFZlcnRpY2VzTGlzdCgpO1xuICAgICAgICB2YXIgaW5jaWRlbmNlTWF0cml4ID0gdGhpcy5fY3JlYXRlRW1wdHkyZEFycmF5KHZlcnRpY2VzLmxlbmd0aCwgZWRnZXMubGVuZ3RoKTtcbiAgICAgICAgdmFyIEZST01fVkVSVEVYID0gLTE7XG4gICAgICAgIHZhciBUT19WRVJURVggPSAxO1xuXG4gICAgICAgIHZhciBjb2x1bW5Db3VudGVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICAgICAgICAgIHZhciBmcm9tSW5kZXggPSB2ZXJ0aWNlcy5pbmRleE9mKGVkZ2UuZ2V0VmVydGljZXMoKVswXSk7XG4gICAgICAgICAgICB2YXIgdG9JbmRleCA9IHZlcnRpY2VzLmluZGV4T2YoZWRnZS5nZXRWZXJ0aWNlcygpWzFdKTtcbiAgICAgICAgICAgIHZhciBmcm9tVmFsdWUgPSAoZWRnZSBpbnN0YW5jZW9mIERpcmVjdGVkRWRnZSkgPyBGUk9NX1ZFUlRFWCA6IFRPX1ZFUlRFWDtcbiAgICAgICAgICAgIHZhciB0b1ZhbHVlID0gVE9fVkVSVEVYO1xuICAgICAgICAgICAgaW5jaWRlbmNlTWF0cml4W2Zyb21JbmRleF1bY29sdW1uQ291bnRlcl0gPSBmcm9tVmFsdWU7XG4gICAgICAgICAgICBpbmNpZGVuY2VNYXRyaXhbdG9JbmRleF1bY29sdW1uQ291bnRlcisrXSA9IHRvVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5jaWRlbmNlTWF0cml4O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm93c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3dMZW5ndGhcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2NyZWF0ZUVtcHR5MmRBcnJheSA9IGZ1bmN0aW9uIChyb3dzLCByb3dMZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyciA9IG5ldyBBcnJheShyb3dzKTtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBhcnJbaV0gPSAobmV3IEFycmF5KHJvd0xlbmd0aCkpLmZpbGwoMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zaXRpb247XG5cbmZ1bmN0aW9uIFBvc2l0aW9uKHgsIHkpIHtcbiAgICB0aGlzLnNldFgoeCk7XG4gICAgdGhpcy5zZXRZKHkpO1xufVxuXG5Qb3NpdGlvbi5wcm90b3R5cGUuc2V0WCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgaWYgKHggPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgdGhpcy5feCA9IHg7XG59O1xuXG5Qb3NpdGlvbi5wcm90b3R5cGUuc2V0WSA9IGZ1bmN0aW9uICh5KSB7XG4gICAgaWYgKHkgPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgdGhpcy5feSA9IHk7XG59O1xuXG5Qb3NpdGlvbi5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbn07XG5cblBvc2l0aW9uLnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl95O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBVbmRpcmVjdGVkRWRnZTtcbnZhciBFZGdlID0gcmVxdWlyZSgnLi9FZGdlJyk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHR3by13YXkgZWRnZVxuICpcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhBXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4QlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFVuZGlyZWN0ZWRFZGdlKHZlcnRleEEsIHZlcnRleEIpIHtcbiAgICBFZGdlLmNhbGwodGhpcywgdmVydGV4QSwgdmVydGV4Qik7XG4gICAgdGhpcy5fdmVydGV4QSA9IHZlcnRleEE7XG4gICAgdGhpcy5fdmVydGV4QiA9IHZlcnRleEI7XG4gICAgdmVydGV4QS5hZGRFZGdlKHRoaXMpO1xuICAgIHZlcnRleEIuYWRkRWRnZSh0aGlzKTtcbn1cblxuVW5kaXJlY3RlZEVkZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFZGdlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQHBhcmFtIHtWZXJ0ZXh9IHZlcnRleFxuICogQHJldHVybiB7VmVydGV4fVxuICovXG5VbmRpcmVjdGVkRWRnZS5wcm90b3R5cGUuZ2V0SW5jaWRlbnRWZXJ0ZXhUbyA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICBzd2l0Y2ggKHZlcnRleCkge1xuICAgICAgICBjYXNlIHRoaXMuX3ZlcnRleEE6IHJldHVybiB0aGlzLl92ZXJ0ZXhCO1xuICAgICAgICBjYXNlIHRoaXMuX3ZlcnRleEI6IHJldHVybiB0aGlzLl92ZXJ0ZXhBO1xuICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmVydGV4OiAnICsgdmVydGV4KTtcbiAgICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlcnRleDtcbnZhciBEaXJlY3RlZEVkZ2UgPSByZXF1aXJlKCcuL0RpcmVjdGVkRWRnZScpO1xudmFyIFVuZGlyZWN0ZWRFZGdlID0gcmVxdWlyZSgnLi9VbmRpcmVjdGVkRWRnZScpO1xudmFyIFBvc2l0aW9uID0gcmVxdWlyZSgnLi9Qb3NpdGlvbicpO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB2ZXJ0ZXg6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZlcnRleF8oZ3JhcGhfdGhlb3J5KVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gaWRcbiAqIEBwYXJhbSB7UG9zaXRpb259IFtwb3NpdGlvbl1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBWZXJ0ZXgoaWQsIHBvc2l0aW9uKSB7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9lZGdlcyA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gKHBvc2l0aW9uIGluc3RhbmNlb2YgUG9zaXRpb24pID8gcG9zaXRpb24gOiBudWxsO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtQb3NpdGlvbnxudWxsfVxuICovXG5WZXJ0ZXgucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtQb3NpdGlvbn0gcG9zaXRpb25cbiAqL1xuVmVydGV4LnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge3N0cmluZ3xudW1iZXJ9XG4gKi9cblZlcnRleC5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5WZXJ0ZXgucHJvdG90eXBlLmZpbHRlckVkZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZWRnZXMgPSB0aGlzLl9lZGdlcy5maWx0ZXIoY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBAcmV0dXJuIHtBcnJheTxFZGdlPn1cbiAqL1xuVmVydGV4LnByb3RvdHlwZS5nZXRFZGdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZWRnZXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RWRnZX0gZWRnZVxuICovXG5WZXJ0ZXgucHJvdG90eXBlLmFkZEVkZ2UgPSBmdW5jdGlvbiAoZWRnZSkge1xuICAgIHRoaXMuX2VkZ2VzLnB1c2goZWRnZSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhcbiAqIEByZXR1cm4ge0RpcmVjdGVkRWRnZX1cbiAqL1xuVmVydGV4LnByb3RvdHlwZS5jcmVhdGVEaXJlY3RlZEVkZ2VUbyA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICByZXR1cm4gbmV3IERpcmVjdGVkRWRnZSh0aGlzLCB2ZXJ0ZXgpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4XG4gKiBAcmV0dXJuIHtVbmRpcmVjdGVkRWRnZX1cbiAqL1xuVmVydGV4LnByb3RvdHlwZS5jcmVhdGVVbmRpcmVjdGVkRWRnZVRvID0gZnVuY3Rpb24gKHZlcnRleCkge1xuICAgIHJldHVybiBuZXcgVW5kaXJlY3RlZEVkZ2UodGhpcywgdmVydGV4KTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7VmVydGV4W119XG4gKi9cblZlcnRleC5wcm90b3R5cGUuZ2V0SW5jaWRlbnRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX2VkZ2VzLnJlZHVjZShmdW5jdGlvbiAoaW5jaWRlbnRWZXJ0aWNlcywgZWRnZSkge1xuICAgICAgICBpZiAoZWRnZSBpbnN0YW5jZW9mIFVuZGlyZWN0ZWRFZGdlIHx8IGVkZ2UuZ2V0RnJvbVZlcnRleCgpID09PSB0aGF0KSB7XG4gICAgICAgICAgICByZXR1cm4gaW5jaWRlbnRWZXJ0aWNlcy5jb25jYXQoZWRnZS5nZXRJbmNpZGVudFZlcnRleFRvKHRoYXQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5jaWRlbnRWZXJ0aWNlcztcbiAgICB9LCBbXSk7XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuVmVydGV4LnByb3RvdHlwZS5nZXRJbkRlZ3JlZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX2VkZ2VzLnJlZHVjZShmdW5jdGlvbiAoaW5EZWdyZWUsIGVkZ2UpIHtcbiAgICAgICAgcmV0dXJuIChlZGdlIGluc3RhbmNlb2YgVW5kaXJlY3RlZEVkZ2UgfHwgZWRnZS5nZXRGcm9tVmVydGV4KCkgIT09IHRoYXQpXG4gICAgICAgICAgICA/IGluRGVncmVlICsgMVxuICAgICAgICAgICAgOiBpbkRlZ3JlZTtcbiAgICB9LCAwKTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5WZXJ0ZXgucHJvdG90eXBlLmdldE91dERlZ3JlZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJbmNpZGVudFZlcnRpY2VzKCkubGVuZ3RoO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYmZzOiBicmVhZHRoRmlyc3RTZWFyY2gsXG4gICAgZGZzOiBkZXB0aEZpcnN0U2VhcmNoXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhcbiAqIEByZXR1cm5zIHtWZXJ0ZXhbXX1cbiAqL1xuZnVuY3Rpb24gZGVwdGhGaXJzdFNlYXJjaCh2ZXJ0ZXgpIHtcbiAgICB2YXIgc3RhY2sgPSBbdmVydGV4XSxcbiAgICAgICAgdmlzaXRlZCA9IFtdO1xuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAodmlzaXRlZC5pbmRleE9mKGN1cnJlbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmlzaXRlZC5wdXNoKGN1cnJlbnQpO1xuICAgICAgICBjdXJyZW50LmdldEluY2lkZW50VmVydGljZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChpbmNpZGVudCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChpbmNpZGVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aXNpdGVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhcbiAqIEByZXR1cm5zIHtWZXJ0ZXhbXX1cbiAqL1xuZnVuY3Rpb24gYnJlYWR0aEZpcnN0U2VhcmNoKHZlcnRleCkge1xuICAgIHZhciBxdWV1ZSA9IFt2ZXJ0ZXhdLFxuICAgICAgICB2aXNpdGVkVmVydGljZXMgPSBbXSxcbiAgICAgICAgY3VycmVudFZlcnRleDtcblxuICAgIGRvIHtcbiAgICAgICAgY3VycmVudFZlcnRleCA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIGlmICh2aXNpdGVkVmVydGljZXMuaW5kZXhPZihjdXJyZW50VmVydGV4KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZpc2l0ZWRWZXJ0aWNlcy5wdXNoKGN1cnJlbnRWZXJ0ZXgpO1xuICAgICAgICBjdXJyZW50VmVydGV4LmdldEluY2lkZW50VmVydGljZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChuZXh0VmVydGV4KSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKG5leHRWZXJ0ZXgpO1xuICAgICAgICB9KTtcbiAgICB9IHdoaWxlIChxdWV1ZS5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIHZpc2l0ZWRWZXJ0aWNlcztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoQ2FudmFzVmlldztcbnZhciBDYW52YXNIZWxwZXIgPSByZXF1aXJlKCcuLi9DYW52YXNIZWxwZXInKTtcbnZhciBHcmFwaCA9IHJlcXVpcmUoJy4uL21vZGVsL0dyYXBoJyk7XG52YXIgUG9zaXRpb24gPSByZXF1aXJlKCcuLi9tb2RlbC9Qb3NpdGlvbicpO1xuXG4vKipcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBHcmFwaENhbnZhc1ZpZXcoZ3JhcGgsIGNhbnZhcykge1xuICAgIHRoaXMuX2dyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuX2NhbnZhc0hlbHBlciA9IG5ldyBDYW52YXNIZWxwZXIoY2FudmFzKTtcbiAgICB0aGlzLl9kcmFnVmVydGV4ID0gbnVsbDtcbiAgICB0aGlzLl91bmNvbXBsZXRlZEVkZ2UgPSBudWxsO1xuICAgIHRoaXMuX3NlbGVjdGVkVmVydGV4ID0gbnVsbDtcbiAgICB0aGlzLl9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrTGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcy5fb25Db250ZXh0TWVudUxpc3RlbmVyLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlbW92ZUxpc3RlbmVyLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZXVwTGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uTW91c2Vkb3duTGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fZ3JhcGgub24oR3JhcGguRVZFTlRfVkVSVEVYX0NSRUFURUQsIHRoaXMuX2RyYXdWZXJ0ZXguYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fc2VsZWN0ZWRWZXJ0ZXhDb2xvciA9ICcjMGYwJztcbiAgICB0aGlzLl92ZXJ0ZXhSYWRpdXMgPSAyMDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4XG4gKi9cbkdyYXBoQ2FudmFzVmlldy5wcm90b3R5cGUuc2V0VmVydGV4QXNTZWxlY3RlZCA9IGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICBpZiAoIXRoaXMuX2dyYXBoLmNvbnRhaW5zVmVydGV4KHZlcnRleCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0IHRvIHNlbGVjdCBub3QgYWRkZWQgdmVydGV4Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VsZWN0ZWRWZXJ0ZXggPSB2ZXJ0ZXg7XG4gICAgdGhpcy5yZWRyYXcoKTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7VmVydGV4fG51bGx9XG4gKi9cbkdyYXBoQ2FudmFzVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRWZXJ0ZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkVmVydGV4O1xufTtcblxuR3JhcGhDYW52YXNWaWV3LnByb3RvdHlwZS5kaXNjYXJkU2VsZWN0ZWRWZXJ0ZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRWZXJ0ZXggPSBudWxsO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1Bvc2l0aW9ufSBwb3NpdGlvblxuICogQHJldHVybiB7VmVydGV4fG51bGx9XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9nZXRWZXJ0ZXhCeVBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl9ncmFwaC5nZXRWZXJ0aWNlc0xpc3QoKS5maW5kKGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoYXQuX2NoZWNrUG9zaXRpb25Jc0luQ2lyY2xlKHBvc2l0aW9uLCB2ZXJ0ZXguZ2V0UG9zaXRpb24oKSwgdGhhdC5fdmVydGV4UmFkaXVzKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtQb3NpdGlvbn0gcG9zaXRpb25cbiAqIEBwYXJhbSB7UG9zaXRpb259IGNpcmNsZVBvc2l0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gY2lyY2xlUmFkaXVzXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9jaGVja1Bvc2l0aW9uSXNJbkNpcmNsZSA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgY2lyY2xlUG9zaXRpb24sIGNpcmNsZVJhZGl1cykge1xuICAgIHJldHVybiBNYXRoLnBvdyhwb3NpdGlvbi5nZXRYKCkgLSBjaXJjbGVQb3NpdGlvbi5nZXRYKCksIDIpXG4gICAgICAgICsgTWF0aC5wb3cocG9zaXRpb24uZ2V0WSgpIC0gY2lyY2xlUG9zaXRpb24uZ2V0WSgpLCAyKVxuICAgICAgICA8PSBNYXRoLnBvdyhjaXJjbGVSYWRpdXMsIDIpO1xufTtcblxuXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLnJlZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9jYW52YXNIZWxwZXIuY2xlYXJDYW52YXMoKTtcbiAgICB2YXIgc3BsaXR0ZWRFZGdlcyA9IHRoaXMuX3NwbGl0RWRnZXNCeVZlcnRpY2VzKHRoaXMuX2dyYXBoLmdldEVkZ2VzTGlzdCgpKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgc3BsaXR0ZWRFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlcykge1xuICAgICAgICB0aGF0Ll9jYW52YXNIZWxwZXIuZHJhd0VkZ2VzKGVkZ2VzKTtcbiAgICB9KTtcbiAgICB0aGlzLl9ncmFwaC5nZXRWZXJ0aWNlc0xpc3QoKS5mb3JFYWNoKGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gKHZlcnRleCA9PT0gdGhhdC5fc2VsZWN0ZWRWZXJ0ZXgpID8gdGhhdC5fc2VsZWN0ZWRWZXJ0ZXhDb2xvciA6IG51bGw7XG4gICAgICAgIHRoYXQuX2NhbnZhc0hlbHBlci5kcmF3Q2lyY2xlKHZlcnRleC5nZXRQb3NpdGlvbigpLCB0aGF0Ll92ZXJ0ZXhSYWRpdXMsIHZlcnRleC5nZXRJZCgpLCBjb2xvcik7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RWRnZVtdfSBlZGdlc1xuICogQHJldHVybiB7QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9zcGxpdEVkZ2VzQnlWZXJ0aWNlcyA9IGZ1bmN0aW9uIChlZGdlcykge1xuICAgIHZhciBoYXNoTWFwID0gW107XG4gICAgZWRnZXMuZm9yRWFjaChmdW5jdGlvbiAoZWRnZSkge1xuICAgICAgICB2YXIgZ2V0SWQgPSBmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdmVydGV4LmdldElkKCk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBoYXNoID0gZWRnZS5nZXRWZXJ0aWNlcygpLm1hcChnZXRJZCkuc29ydCgpLmpvaW4oJycpO1xuICAgICAgICBpZiAoaGFzaE1hcFtoYXNoXSkge1xuICAgICAgICAgICAgaGFzaE1hcFtoYXNoXS5wdXNoKGVkZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFzaE1hcFtoYXNoXSA9IFtlZGdlXTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciB3aXRob3V0SGFzaCA9IFtdO1xuICAgIGZvciAodmFyIGkgaW4gaGFzaE1hcCkge1xuICAgICAgICB3aXRob3V0SGFzaC5wdXNoKGhhc2hNYXBbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gd2l0aG91dEhhc2g7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9vbkNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgY2xpY2tQb3NpdGlvbiA9IHRoaXMuX2dldEV2ZW50UG9zaXRpb24oZXZlbnQpO1xuICAgIHZhciB2ZXJ0ZXggPSB0aGlzLl9nZXRWZXJ0ZXhCeVBvc2l0aW9uKGNsaWNrUG9zaXRpb24pO1xuICAgIGlmICghdGhpcy5fZHJhZ1ZlcnRleCAmJiAhdmVydGV4KSB7XG4gICAgICAgIHRoaXMuX2dyYXBoLmNyZWF0ZVZlcnRleFdpdGhQb3NpdGlvbihjbGlja1Bvc2l0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHZlcnRleCAmJiB0aGlzLl9jdHJsS2V5SXNQcmVzc2VkKGV2ZW50KSkge1xuICAgICAgICB0aGlzLnNldFZlcnRleEFzU2VsZWN0ZWQodmVydGV4KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9vbkNvbnRleHRNZW51TGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjbGlja1Bvc2l0aW9uID0gdGhpcy5fZ2V0RXZlbnRQb3NpdGlvbihldmVudCk7XG4gICAgdmFyIHZlcnRleCA9IHRoaXMuX2dldFZlcnRleEJ5UG9zaXRpb24oY2xpY2tQb3NpdGlvbik7XG4gICAgaWYgKHRoaXMuX2N0cmxLZXlJc1ByZXNzZWQoZXZlbnQpICYmIHZlcnRleCkge1xuICAgICAgICB0aGlzLl9ncmFwaC5kZWxldGVWZXJ0ZXgodmVydGV4KTtcbiAgICB9IGVsc2UgaWYgKHZlcnRleCkge1xuICAgICAgICBpZiAodGhpcy5fdW5jb21wbGV0ZWRFZGdlKSB7XG4gICAgICAgICAgICB2YXIgdmVydGV4RnJvbSA9IHRoaXMuX2dldFZlcnRleEJ5UG9zaXRpb24odGhpcy5fdW5jb21wbGV0ZWRFZGdlKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlyZWN0ZWQtZWRnZScpLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncmFwaC5hZGRFZGdlKHZlcnRleEZyb20uY3JlYXRlRGlyZWN0ZWRFZGdlVG8odmVydGV4KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2dyYXBoLmFkZEVkZ2UodmVydGV4RnJvbS5jcmVhdGVVbmRpcmVjdGVkRWRnZVRvKHZlcnRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdW5jb21wbGV0ZWRFZGdlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodmVydGV4KSB7XG4gICAgICAgICAgICB0aGlzLl91bmNvbXBsZXRlZEVkZ2UgPSB2ZXJ0ZXguZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fdW5jb21wbGV0ZWRFZGdlICYmICF2ZXJ0ZXgpIHtcbiAgICAgICAgdGhpcy5fdW5jb21wbGV0ZWRFZGdlID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9vbk1vdXNlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIG1vdXNlUG9zaXRpb24gPSB0aGlzLl9nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcbiAgICBpZiAodGhpcy5fdW5jb21wbGV0ZWRFZGdlKSB7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIHZhciBpc0VkZ2VEaXJlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXJlY3RlZC1lZGdlJykuY2hlY2tlZDtcbiAgICAgICAgdGhpcy5fY2FudmFzSGVscGVyLmRyYXdMaW5lKGlzRWRnZURpcmVjdGVkLCB0aGlzLl91bmNvbXBsZXRlZEVkZ2UsIG1vdXNlUG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZHJhZ1ZlcnRleCkge1xuICAgICAgICB0aGlzLl9kcmFnVmVydGV4LnNldFBvc2l0aW9uKG1vdXNlUG9zaXRpb24pO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cbn07XG5cbkdyYXBoQ2FudmFzVmlldy5wcm90b3R5cGUuX29uTW91c2V1cExpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9kcmFnVmVydGV4KSB7XG4gICAgICAgIHRoaXMuX2RyYWdWZXJ0ZXggPSBudWxsO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwcml2YXRlXG4gKi9cbkdyYXBoQ2FudmFzVmlldy5wcm90b3R5cGUuX29uTW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgdmVydGV4ID0gdGhpcy5fZ2V0VmVydGV4QnlQb3NpdGlvbih0aGlzLl9nZXRFdmVudFBvc2l0aW9uKGV2ZW50KSk7XG4gICAgaWYgKCF2ZXJ0ZXgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLl9kcmFnVmVydGV4ID0gdmVydGV4O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybiB7UG9zaXRpb259XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9nZXRFdmVudFBvc2l0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGJvdW5kaW5nQ2xpZW50UmVjdCA9IHRoaXMuX2NhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uKFxuICAgICAgICBwYXJzZUludChldmVudC5jbGllbnRYIC0gYm91bmRpbmdDbGllbnRSZWN0LmxlZnQpLFxuICAgICAgICBwYXJzZUludChldmVudC5jbGllbnRZIC0gYm91bmRpbmdDbGllbnRSZWN0LnRvcClcbiAgICApO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cbkdyYXBoQ2FudmFzVmlldy5wcm90b3R5cGUuX2N0cmxLZXlJc1ByZXNzZWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1ZlcnRleH0gdmVydGV4XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLl9kcmF3VmVydGV4ID0gZnVuY3Rpb24gKHZlcnRleCkge1xuICAgIHRoaXMuX2NhbnZhc0hlbHBlci5kcmF3Q2lyY2xlKHZlcnRleC5nZXRQb3NpdGlvbigpLCB0aGlzLl92ZXJ0ZXhSYWRpdXMsIHZlcnRleC5nZXRJZCgpKTtcbn07XG5cbi8qKlxuICogVE9ETzogZGVsZXRlIHRoaXNcbiAqIEByZXR1cm4ge0NhbnZhc0hlbHBlcn1cbiAqL1xuR3JhcGhDYW52YXNWaWV3LnByb3RvdHlwZS5nZXRDYW52YXNIZWxwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbnZhc0hlbHBlcjtcbn07XG5cbi8qKlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5HcmFwaENhbnZhc1ZpZXcucHJvdG90eXBlLmdldFZlcnRleFJhZGl1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmVydGV4UmFkaXVzO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaEh0bWxUYWJsZVZpZXc7XG52YXIgR3JhcGggPSByZXF1aXJlKCcuLy4uL21vZGVsL0dyYXBoJyk7XG52YXIgRGlyZWN0ZWRFZGdlID0gcmVxdWlyZSgnLi8uLi9tb2RlbC9EaXJlY3RlZEVkZ2UnKTtcblxuLyoqXG4gKiBAcGFyYW0ge0dyYXBofSBncmFwaFxuICogQHBhcmFtIHtHcmFwaENvbnZlcnRlcn0gZ3JhcGhDb252ZXJ0ZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBHcmFwaEh0bWxUYWJsZVZpZXcoZ3JhcGgsIGdyYXBoQ29udmVydGVyKSB7XG4gICAgdGhpcy5fZ3JhcGggPSBncmFwaDtcbiAgICB0aGlzLl9ncmFwaENvbnZlcnRlciA9IGdyYXBoQ29udmVydGVyO1xuICAgIHRoaXMuX3NldFVwRXZlbnRMaXN0ZW5lcnMoKTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaEh0bWxUYWJsZVZpZXcucHJvdG90eXBlLl9zZXRVcEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2dyYXBoLm9uKEdyYXBoLkVWRU5UX1ZFUlRFWF9DUkVBVEVELFxuICAgICAgICB0aGlzLnJlYnVpbGRBZGphY2VuY3lMaXN0QWN0aW9uLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMucmVidWlsZEFkamFjZW5jeU1hdHJpeEFjdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgICB0aGlzLnJlYnVpbGREZWdyZWVzVGFibGUuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5fZ3JhcGgub24oR3JhcGguRVZFTlRfRURHRV9BRERFRCxcbiAgICAgICAgdGhpcy5yZWJ1aWxkSW5jaWRlbmNlTWF0cml4QWN0aW9uLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMucmVidWlsZEFkamFjZW5jeUxpc3RBY3Rpb24uYmluZCh0aGlzKSxcbiAgICAgICAgdGhpcy5yZWJ1aWxkQWRqYWNlbmN5TWF0cml4QWN0aW9uLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMucmVidWlsZERlZ3JlZXNUYWJsZS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgICB0aGlzLl9ncmFwaC5vbihHcmFwaC5FVkVOVF9WRVJURVhfREVMRVRFRCxcbiAgICAgICAgdGhpcy5yZWJ1aWxkQWRqYWNlbmN5TGlzdEFjdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgICB0aGlzLnJlYnVpbGRBZGphY2VuY3lNYXRyaXhBY3Rpb24uYmluZCh0aGlzKSxcbiAgICAgICAgdGhpcy5yZWJ1aWxkSW5jaWRlbmNlTWF0cml4QWN0aW9uLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMucmVidWlsZERlZ3JlZXNUYWJsZS5iaW5kKHRoaXMpXG4gICAgKTtcbn07XG5cbkdyYXBoSHRtbFRhYmxlVmlldy5wcm90b3R5cGUucmVidWlsZEluY2lkZW5jZU1hdHJpeEFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5jaWRlbmNlTWF0cml4ID0gdGhpcy5fZ3JhcGhDb252ZXJ0ZXIudG9JbmNpZGVuY2VNYXRyaXgodGhpcy5fZ3JhcGgpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmNpZGVuY2UtbWF0cml4LXJlcHJlc2VudGF0aW9uJylcbiAgICAgICAgLmlubmVySFRNTCA9IHRoaXMuX2luY2lkZW5jZU1hdHJpeFRvSHRtbFRhYmxlKGluY2lkZW5jZU1hdHJpeCk7XG59O1xuXG5HcmFwaEh0bWxUYWJsZVZpZXcucHJvdG90eXBlLnJlYnVpbGRBZGphY2VuY3lNYXRyaXhBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFkamFjZW5jeU1hdHJpeCA9IHRoaXMuX2dyYXBoQ29udmVydGVyLnRvQWRqYWNlbmN5TWF0cml4KHRoaXMuX2dyYXBoKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRqYWNlbmN5LW1hdHJpeC1yZXByZXNlbnRhdGlvbicpXG4gICAgICAgIC5pbm5lckhUTUwgPSB0aGlzLl9hZGphY2VuY3lNYXRyaXhUb0h0bWxUYWJsZShhZGphY2VuY3lNYXRyaXgsIHRoaXMuX2dyYXBoLmdldFZlcnRpY2VzTGlzdCgpKTtcbn07XG5cbkdyYXBoSHRtbFRhYmxlVmlldy5wcm90b3R5cGUucmVidWlsZEFkamFjZW5jeUxpc3RBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkamFjZW5jeS1saXN0LXJlcHJlc2VudGF0aW9uJylcbiAgICAgICAgLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkQWRqYWNlbmN5TGlzdEh0bWwodGhpcy5fZ3JhcGguZ2V0VmVydGljZXNMaXN0KCkpO1xufTtcblxuR3JhcGhIdG1sVGFibGVWaWV3LnByb3RvdHlwZS5yZWJ1aWxkRGVncmVlc1RhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWdyZWVzLXJlcHJlc2VudGF0aW9uJylcbiAgICAgICAgLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkRGVncmVlc1RhYmxlKHRoaXMuX2dyYXBoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtWZXJ0ZXhbXX0gdmVydGljZXNMaXN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaEh0bWxUYWJsZVZpZXcucHJvdG90eXBlLl9idWlsZEFkamFjZW5jeUxpc3RIdG1sID0gZnVuY3Rpb24gKHZlcnRpY2VzTGlzdCkge1xuICAgIGlmICghdmVydGljZXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzZXBhcmF0b3IgPSAnLCAnLFxuICAgICAgICByZXN1bHRIdG1sID0gXCI8dGFibGU+PHRyPjx0aD5WZXJ0ZXg8L3RoPjx0aD5BZGphY2VudCB2ZXJ0aWNlczwvdGg+PC90cj5cIjtcbiAgICB2ZXJ0aWNlc0xpc3QuZm9yRWFjaChmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgICAgIHJlc3VsdEh0bWwgKz0gXCI8dHI+PHRkPlwiXG4gICAgICAgICAgICArIHZlcnRleC5nZXRJZCgpXG4gICAgICAgICAgICArIFwiPC90ZD48dGQ+XCJcbiAgICAgICAgICAgICsgdmVydGV4LmdldEluY2lkZW50VmVydGljZXMoKS5tYXAoZnVuY3Rpb24gKHZlcnRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2ZXJ0ZXguZ2V0SWQoKTtcbiAgICAgICAgICAgIH0pLmpvaW4oc2VwYXJhdG9yKVxuICAgICAgICAgICAgKyBcIjwvdGQ+PC90cj5cIjtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0SHRtbCArIFwiPC90YWJsZT5cIjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5fSBhZGphY2VuY3lNYXRyaXhcbiAqIEBwYXJhbSB7QXJyYXk8VmVydGV4Pn0gdmVydGljZXNMaXN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaEh0bWxUYWJsZVZpZXcucHJvdG90eXBlLl9hZGphY2VuY3lNYXRyaXhUb0h0bWxUYWJsZSA9IGZ1bmN0aW9uIChhZGphY2VuY3lNYXRyaXgsIHZlcnRpY2VzTGlzdCkge1xuICAgIGlmICghdmVydGljZXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHRIdG1sID0gXCI8dGFibGU+PHRyPjx0aD48L3RoPlwiO1xuICAgIHJlc3VsdEh0bWwgKz0gdmVydGljZXNMaXN0Lm1hcChmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgICAgIHJldHVybiBcIjx0aD5cIiArIHZlcnRleC5nZXRJZCgpICsgXCI8L3RoPlwiO1xuICAgIH0pLmpvaW4oJycpO1xuICAgIHJlc3VsdEh0bWwgKz0gXCI8L3RyPlwiO1xuICAgIHZhciBpID0gMDtcbiAgICByZXN1bHRIdG1sICs9IHZlcnRpY2VzTGlzdC5tYXAoZnVuY3Rpb24gKHZlcnRleCkge1xuICAgICAgICByZXR1cm4gXCI8dHI+PHRkPlwiICsgdmVydGV4LmdldElkKCkgKyBcIjwvdGQ+XCJcbiAgICAgICAgICAgICsgYWRqYWNlbmN5TWF0cml4W2krK10ubWFwKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjx0ZD5cIiArIGZpZWxkICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgfSkuam9pbignJylcbiAgICAgICAgICAgICsgXCI8L3RyPlwiO1xuICAgIH0pLmpvaW4oJycpO1xuICAgIHJldHVybiByZXN1bHRIdG1sICsgXCI8L3RhYmxlPlwiO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5fSBpbmNpZGVuY2VNYXRyaXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbkdyYXBoSHRtbFRhYmxlVmlldy5wcm90b3R5cGUuX2luY2lkZW5jZU1hdHJpeFRvSHRtbFRhYmxlID0gZnVuY3Rpb24gKGluY2lkZW5jZU1hdHJpeCkge1xuICAgIGlmICghaW5jaWRlbmNlTWF0cml4Lmxlbmd0aCB8fCBpbmNpZGVuY2VNYXRyaXguZXZlcnkoZnVuY3Rpb24gKHJvdykge1xuICAgICAgICAgICAgcmV0dXJuIHJvdy5sZW5ndGggPT09IDBcbiAgICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0SHRtbCA9IFwiPHRhYmxlPjx0cj48dGggY29sc3Bhbj0nMTAwJSc+SW5jaWRlbmNlIE1hdHJpeDwvdGg+PC90cj5cIjtcbiAgICByZXN1bHRIdG1sICs9IGluY2lkZW5jZU1hdHJpeC5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgICAgICByZXR1cm4gXCI8dHI+XCIgKyByb3cubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjx0ZD5cIiArIGVsICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgfSkuam9pbignJykgKyBcIjwvdHI+XCI7XG4gICAgfSkuam9pbignJyk7XG4gICAgcmV0dXJuIHJlc3VsdEh0bWwgKyBcIjwvdGFibGU+XCI7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5HcmFwaEh0bWxUYWJsZVZpZXcucHJvdG90eXBlLl9idWlsZERlZ3JlZXNUYWJsZSA9IGZ1bmN0aW9uIChncmFwaCkge1xuICAgIHZhciByZXN1bHQgPSBcIjx0YWJsZT48dHI+PHRoPjwvdGg+PHRoPmluRGVncmVlPC90aD48dGg+b3V0RGVncmVlPC90aD48L3RyPlwiO1xuICAgIGdyYXBoLmdldFZlcnRpY2VzTGlzdCgpLmZvckVhY2goZnVuY3Rpb24gKHZlcnRleCkge1xuICAgICAgICByZXN1bHQgKz0gXCI8dHI+XCI7XG4gICAgICAgIHJlc3VsdCArPSBcIjx0ZD5cIiArIHZlcnRleC5nZXRJZCgpICsgXCI8L3RkPlwiO1xuICAgICAgICByZXN1bHQgKz0gXCI8dGQ+XCIgKyB2ZXJ0ZXguZ2V0SW5EZWdyZWUoKSArIFwiPC90ZD5cIjtcbiAgICAgICAgcmVzdWx0ICs9IFwiPHRkPlwiICsgdmVydGV4LmdldE91dERlZ3JlZSgpICsgXCI8L3RkPlwiO1xuICAgICAgICByZXN1bHQgKz0gXCI8L3RyPlwiO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQgKyBcIjwvdGFibGU+XCI7XG59OyJdfQ==
