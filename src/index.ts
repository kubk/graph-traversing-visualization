import { Graph } from './model/graph';
import { HtmlTableController } from './controller/html-table-controller';
import { CanvasController } from './controller/canvas-controller';
import { TraversingAnimationController } from './controller/traversing-animation-controller';
import { TemplateRenderer } from './view/template-renderer';
import './scss/styles.scss';
import { CanvasRenderer } from './view/canvas-renderer';

const graph = new Graph();
const templateRenderer = new TemplateRenderer();
const htmlTableController = new HtmlTableController(graph, templateRenderer);

window.addEventListener('load', () => {
  htmlTableController.setUpEventListeners();
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const canvasRenderer = new CanvasRenderer(canvas);
  const graphCanvasController = new CanvasController(graph, canvas, canvasRenderer);
  const verticesTraversingAnimation = new TraversingAnimationController(
    graphCanvasController,
    canvasRenderer,
    document.getElementById('start-search') as HTMLButtonElement,
    document.getElementById('depth-first-search') as HTMLInputElement
  );
  verticesTraversingAnimation.setUpEventListeners();
});
