import { EventEmitter } from '../model/event-emitter';
import { CanvasController } from './canvas-controller';
import {
  breadthFirstSearch,
  depthFirstSearch,
  TraversingAlgorithm
} from '../model/traversing-algorithms';
import { Vertex } from '../model/vertex';

export class TraversingAnimationController extends EventEmitter {
  static EVENT_VERTEX_VISITED = 'vertexVisited';
  private vertexVisitDelay = 500;
  private visitedVertexColor = '#f00';

  constructor(
    private graphCanvasView: CanvasController,
    private animationStartButton: HTMLButtonElement,
    private dfsButton: HTMLInputElement
  ) {
    super();
  }

  setUpEventListeners() {
    this.animationStartButton.addEventListener(
      'click',
      this.onAnimationButtonClick.bind(this, this.dfsButton.checked)
    );
  }

  private onAnimationButtonClick(isDfsButtonChecked: boolean): void {
    const traversingAlgo = isDfsButtonChecked ? depthFirstSearch : breadthFirstSearch;
    this.startAnimation(traversingAlgo);
  }

  private startAnimation(traversingAlgo: TraversingAlgorithm): void {
    const startFromVertex = this.graphCanvasView.getSelectedVertex();

    if (!startFromVertex) {
      return alert('Select start vertex using Ctrl + left mouse click');
    }

    const visitedVertices = traversingAlgo(startFromVertex);
    this.animateVisited(visitedVertices);
    this.graphCanvasView.discardSelectedVertex();
  }

  animateVisited(visitedVertices: Vertex[]): void {
    const currentVertex = visitedVertices.shift();

    if (currentVertex) {
      this.trigger(TraversingAnimationController.EVENT_VERTEX_VISITED);
      this.graphCanvasView.canvasHelper.drawCircle(
        currentVertex.getPosition()!,
        this.graphCanvasView.getVertexRadius() + 10,
        currentVertex.getId().toString(),
        this.visitedVertexColor
      );
      setTimeout(() => this.animateVisited.bind(visitedVertices), this.vertexVisitDelay);
    } else {
      alert('Animation completed');
    }
  }
}
