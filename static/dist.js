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
     * @param {Vertex[]} verticesList
     * @return {Array}
     */
    this.verticesListToAdjacencyMatrix = function (verticesList) {
        return verticesList.map(function (vertex) {
            return verticesList.map(function (vertexInRow) {
                return vertex.getIncidentVertices().filter(function (vertex) {
                    return vertex === vertexInRow;
                }).length;
            });
        });
    };

    /**
     * @param {Edge[]} edgesList
     * @param {Vertex[]} verticesList
     * @return {Array}
     */
    this.edgesListToIncidenceMatrix = function (edgesList, verticesList) {
        var incidenceMatrix = this._createEmpty2dArray(verticesList.length, edgesList.length);
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
    var incidentVertices = [];
    var that = this;
    this._edges.forEach(function (edge) {
        if (edge instanceof UndirectedEdge || edge.getFromVertex() === that) {
            incidentVertices.push(edge.getIncidentVertexTo(that));
        }
    });
    return incidentVertices;
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
    var that = this;
    return this._edges.reduce(function (outDegree, edge) {
        return (edge instanceof UndirectedEdge || edge.getFromVertex() === that)
            ? outDegree + 1
            : outDegree;
    }, 0);
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
    this._edgesListToIncidenceMatrix = graphConverter.edgesListToIncidenceMatrix;
    this._verticesListToAdjacencyMatrix = graphConverter.verticesListToAdjacencyMatrix;
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
    var incidenceMatrix = this._edgesListToIncidenceMatrix(this._graph.getEdgesList(), this._graph.getVerticesList());
    document.getElementById('incidence-matrix-representation')
        .innerHTML = this._incidenceMatrixToHtmlTable(incidenceMatrix);
};

GraphHtmlTableView.prototype.rebuildAdjacencyMatrixAction = function () {
    var adjacencyMatrix = this._verticesListToAdjacencyMatrix(this._graph.getVerticesList());
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
 * @param {number} rows
 * @param {number} rowLength
 * @return {Array}
 * @private
 */
GraphHtmlTableView.prototype._createEmpty2dArray = function (rows, rowLength) {
    var array = [];
    var fillWith = 0;
    for (var i = 0; i < rows; i++) {
        array[i] = [];
        for (var j = 0; j < rowLength; j++) {
            array[i].push(fillWith);
        }
    }
    return array;
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
},{"./../model/DirectedEdge":4,"./../model/Graph":7}]},{},[3]);
