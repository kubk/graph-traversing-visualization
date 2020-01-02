import { EventEmitter } from '../model/event-emitter';
import { CanvasController } from './canvas-controller';
import {
  breadthFirstSearch,
  depthFirstSearch,
  TraversingAlgorithm
} from '../model/traversing-algorithms';
import { Vertex } from '../model/vertex';
import { CanvasRenderer } from '../view/canvas-renderer';

type AnimationEvents = {
  vertexVisited: () => void;
};

export class TraversingAnimationController extends EventEmitter<AnimationEvents> {
  private vertexVisitDelay = 500;
  private visitedVertexColor = '#f00';

  constructor(
    private graphCanvasController: CanvasController,
    private canvasRenderer: CanvasRenderer,
    private animationStartButton: HTMLButtonElement,
    private dfsButton: HTMLInputElement
  ) {
    super();
  }

  setUpEventListeners() {
    this.animationStartButton.addEventListener('click', () =>
      this.onAnimationButtonClick(this.dfsButton.checked)
    );
  }

  private onAnimationButtonClick(isDfsButtonChecked: boolean): void {
    const traversingAlgo = isDfsButtonChecked ? depthFirstSearch : breadthFirstSearch;
    this.startAnimation(traversingAlgo);
  }

  private startAnimation(traversingAlgo: TraversingAlgorithm): void {
    const startFromVertex = this.graphCanvasController.getSelectedVertex();

    if (!startFromVertex) {
      return alert('Select start vertex using Ctrl + left mouse click');
    }

    const visitedVertices = traversingAlgo(startFromVertex);
    this.animateVisited(visitedVertices);
    this.graphCanvasController.discardSelectedVertex();
  }

  animateVisited(visitedVertices: Vertex[]): void {
    const currentVertex = visitedVertices.shift();

    if (currentVertex) {
      this.trigger('vertexVisited');
      this.canvasRenderer.drawCircle(
        currentVertex.getPosition()!,
        this.graphCanvasController.getVertexRadius() + 10,
        currentVertex.getId().toString(),
        this.visitedVertexColor
      );
      setTimeout(() => this.animateVisited(visitedVertices), this.vertexVisitDelay);
    } else {
      alert('Animation completed');
    }
  }
}
