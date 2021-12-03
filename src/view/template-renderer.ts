import { Vertex } from '../model/vertex';
import { AdjacencyMatrix, IncidenceMatrix } from '../model/graph-converters';

export class TemplateRenderer {
  renderAdjacencyList(vertices: Vertex[]): string {
    if (!vertices.length) {
      return '';
    }

    return `<table class="graph-table">
    <thead>
      <tr>
        <th>Vertex</th>
        <th>Adjacent vertices</th>
      </tr>
      </thead>
      <tbody>
      ${vertices
        .map(
          vertex => `<tr>
          <td>${vertex.id}</td>
          <td>
            ${vertex
              .getAdjacentVertices()
              .map(vertex => vertex.id)
              .join(',')}
          </td>
        </tr>`
        )
        .join('')}
      </tbody>
    </table>`;
  }

  renderAdjacencyMatrix(adjacencyMatrix: AdjacencyMatrix, vertices: Vertex[]): string {
    if (!vertices.length) {
      return '';
    }

    const adjacencyTable = adjacencyMatrix.map((row, i) => [vertices[i].id].concat(row));

    return `<table class="graph-table">
      <tr>
        <th></th>
        ${vertices.map(vertex => `<th>${vertex.id}</th>`).join('')}
       </tr>
       ${adjacencyTable
         .map(row => {
           return `<tr>${row.map(column => `<td>${column}</td>`).join('')}</tr>`;
         })
         .join('')}
    </table>`;
  }

  renderIncidenceMatrix(incidenceMatrix: IncidenceMatrix): string {
    if (!incidenceMatrix.length || incidenceMatrix.every(row => row.length === 0)) {
      return '';
    }

    return `<table class="graph-table">
      <tr>
        <th colspan='100%'>Incidence Matrix</th>
      </tr>
      ${incidenceMatrix
        .map(row => {
          return `<tr>${row.map(column => `<td>${column}</td>`).join('')}</tr>`;
        })
        .join('')}
    </table>`;
  }

  renderDegreesTable(vertices: Vertex[]): string {
    return `<table class="graph-table">
      <tr>
        <th></th>
        <th>In degree</th>
        <th>Out degree</th>
      </tr>
      ${vertices
        .map(vertex => {
          return `
          <tr>
            <td>${vertex.id}</td>
            <td>${vertex.getInDegree()}</td>
            <td>${vertex.getOutDegree()}</td>
          </tr>
        `;
        })
        .join('')}
    </table>`;
  }
}
