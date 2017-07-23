"use strict";

const Graph = require('./../model/Graph');
const DirectedEdge = require('./../model/DirectedEdge');
const Handlebars = require('handlebars');

class GraphHtmlTableView {
    /**
     * @param {Graph} graph
     * @param {GraphConverter} graphConverter
     */
    constructor(graph, graphConverter) {
        this.graph = graph;
        this.graphConverter = graphConverter;
        this.setUpEventListeners();
    }

    /**
     * @private
     */
    setUpEventListeners() {
        this.graph.on(Graph.EVENT_VERTEX_CREATED,
            this.rebuildAdjacencyListAction.bind(this),
            this.rebuildAdjacencyMatrixAction.bind(this),
            this.rebuildDegreesTable.bind(this)
        );
        this.graph.on(Graph.EVENT_EDGE_ADDED,
            this.rebuildIncidenceMatrixAction.bind(this),
            this.rebuildAdjacencyListAction.bind(this),
            this.rebuildAdjacencyMatrixAction.bind(this),
            this.rebuildDegreesTable.bind(this)
        );
        this.graph.on(Graph.EVENT_VERTEX_DELETED,
            this.rebuildAdjacencyListAction.bind(this),
            this.rebuildAdjacencyMatrixAction.bind(this),
            this.rebuildIncidenceMatrixAction.bind(this),
            this.rebuildDegreesTable.bind(this)
        );
    }

    rebuildIncidenceMatrixAction() {
        const incidenceMatrix = this.graphConverter.toIncidenceMatrix(this.graph);
        document.getElementById('incidence-matrix-representation')
            .innerHTML = this.incidenceMatrixToHtmlTable(incidenceMatrix);
    }

    rebuildAdjacencyMatrixAction() {
        const adjacencyMatrix = this.graphConverter.toAdjacencyMatrix(this.graph);
        document.getElementById('adjacency-matrix-representation')
            .innerHTML = this.adjacencyMatrixToHtmlTable(adjacencyMatrix, this.graph.getVerticesList());
    }

    rebuildAdjacencyListAction() {
        document.getElementById('adjacency-list-representation')
            .innerHTML = this.buildAdjacencyListHtml(this.graph.getVerticesList());
    }

    rebuildDegreesTable() {
        document.getElementById('degrees-representation')
            .innerHTML = this.buildDegreesTable(this.graph);
    }

    /**
     * @param {Vertex[]} verticesList
     * @return {string}
     * @private
     */
    buildAdjacencyListHtml(verticesList) {
        if (!verticesList.length) {
            return '';
        }

        const source = `<table>
            <tr>
                <th>Vertex</th>
                <th>Adjacent vertices</th>
            </tr>
            {{#each verticesList}}
                <tr>
                    <td>{{ getId }}</td>
                    <td>
                        {{#each this.getIncidentVertices}}
                            {{ getId }}{{#unless @last}},{{/unless}}
                        {{/each}}
                    </td>
                </tr>
            {{/each}}
        </table>`;

        const template = Handlebars.compile(source);

        return template({verticesList});
    }

    /**
     * @param {Array} adjacencyMatrix
     * @param {Vertex[]} verticesList
     * @return {string}
     * @private
     */
    adjacencyMatrixToHtmlTable(adjacencyMatrix, verticesList) {
        if (!verticesList.length) {
            return '';
        }

        const adjacencyTable = adjacencyMatrix.map((row, i) => [verticesList[i].id].concat(row));

        const source = `<table>
            <tr>
                <th></th>
                {{#each verticesList}}
                    <th>{{ getId }}</th>
                {{/each}}
            </tr>
            
            {{#each adjacencyTable}}
                <tr>
                {{#each this}}
                    <td>{{ this }}</td>
                {{/each}}
                </tr>
            {{/each}}
        </table>`;

        const template = Handlebars.compile(source);

        return template({verticesList, adjacencyTable});
    }

    /**
     * @param {Array} incidenceMatrix
     * @return {string}
     * @private
     */
    incidenceMatrixToHtmlTable(incidenceMatrix) {
        if (!incidenceMatrix.length || incidenceMatrix.every(row => row.length === 0)) {
            return '';
        }

        const source = `<table>
            <tr>
                <th colspan='100%'>Incidence Matrix</th>
            </tr>
            {{#each incidenceMatrix}}
                <tr>
                    {{#each this}}
                        <td>{{ this }}</td>
                    {{/each}}
                </tr>
            {{/each}}
        </table>`;

        const template = Handlebars.compile(source);

        return template({incidenceMatrix});
    }

    /**
     * @param {Graph} graph
     * @return {string}
     * @private
     */
    buildDegreesTable(graph) {
        const source = `<table>
            <tr>
                <th></th>
                <th>In degree</th>
                <th>Out degree</th>
            </tr>
            {{#each vertices}}
            <tr>
                <td>{{ getId }}</td>
                <td>{{ getInDegree }}</td>
                <td>{{ getOutDegree }}</td>
            </tr>
            {{/each}}
        </table>`;

        const template = Handlebars.compile(source);

        return template({vertices: graph.getVerticesList()});
    }
}

module.exports = GraphHtmlTableView;
