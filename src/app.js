var Graph = require('./model/Graph');
var GraphCanvasView = require('./view/GraphCanvasView');
var GraphHtmlTableView = require('./view/GraphHtmlTableView');
var VerticesTraversingAnimation = require('./VerticesTraversingAnimation');

var graph = new Graph();
var graphHtmlTableView = new GraphHtmlTableView(graph);

window.addEventListener('load', function () {
    var graphCanvasView = new GraphCanvasView(graph, document.getElementById('canvas'));
    var verticesTraversingAnimation = new VerticesTraversingAnimation(
        graphCanvasView,
        document.getElementById('start-search'),
        document.getElementById('depth-first-search')
    );
});