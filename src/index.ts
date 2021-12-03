import { Graph } from './model/graph';
import { HtmlTableController } from './controller/html-table-controller';
import { CanvasController } from './controller/canvas-controller';
import { TraversingAnimationController } from './controller/traversing-animation-controller';
import { TemplateRenderer } from './view/template-renderer';
import './scss/styles.scss';

const graph = new Graph();
const templateRenderer = new TemplateRenderer();
const graphHtmlTableView = new HtmlTableController(graph, templateRenderer);

window.addEventListener('load', () => {
  graphHtmlTableView.setUpEventListeners();
  const graphCanvasView = new CanvasController(
    graph,
    document.getElementById('canvas') as HTMLCanvasElement
  );
  const verticesTraversingAnimation = new TraversingAnimationController(
    graphCanvasView,
    document.getElementById('start-search') as HTMLButtonElement,
    document.getElementById('depth-first-search') as HTMLInputElement
  );
  verticesTraversingAnimation.setUpEventListeners();
});
