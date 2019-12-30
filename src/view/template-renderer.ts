import Handlebars from 'handlebars';
import { Vertex } from '../model/vertex';
import { AdjacencyMatrix, IncidenceMatrix } from '../model/graph-converters';

export class TemplateRenderer {
  renderAdjacencyList(vertices: Vertex[]): string {
    if (!vertices.length) {
      return '';
    }

    const source = `<table>
      <tr>
        <th>Vertex</th>
        <th>Adjacent vertices</th>
      </tr>
      {{#each vertices}}
        <tr>
          <td>{{ getId }}</td>
          <td>
            {{#each this.getAdjacentVertices}}
              {{ getId }}{{#unless @last}},{{/unless}}
            {{/each}}
          </td>
        </tr>
      {{/each}}
    </table>`;

    const template = Handlebars.compile(source);

    return template({ vertices });
  }

  renderAdjacencyMatrix(adjacencyMatrix: AdjacencyMatrix, vertices: Vertex[]): string {
    if (!vertices.length) {
      return '';
    }

    const adjacencyTable = adjacencyMatrix.map((row, i) => [vertices[i].getId()].concat(row));

    const source = `<table>
      <tr>
        <th></th>
        {{#each vertices}}
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

    return template({ vertices, adjacencyTable });
  }

  renderIncidenceMatrix(incidenceMatrix: IncidenceMatrix): string {
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

    return template({ incidenceMatrix });
  }

  renderDegreesTable(vertices: Vertex[]): string {
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

    return template({ vertices });
  }
}
