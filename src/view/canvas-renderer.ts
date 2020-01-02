import { Position } from '../model/position';
import { DirectedEdge } from '../model/directed-edge';
import { UndirectedEdge } from '../model/undirected-edge';
import { getQuadraticCurveCoord } from './get-quadratic-curve-coordinate';
import { createEdgeShiftGenerator } from './create-edge-shift-generator';

export class CanvasRenderer {
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private fontSize = 13;
  private ratio = 0.5;
  private arrowLength = 20;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clearCanvas(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawUndirectedLine(
    fromPosition: Position,
    toPosition: Position,
    lineWidth?: number,
    strokeStyle?: string
  ): void {
    if (lineWidth) {
      if (!Number.isInteger(lineWidth) || lineWidth < 1) {
        throw new TypeError('LineWidth must be a positive integer, given: ' + lineWidth);
      }
      this.context.lineWidth = lineWidth;
    }
    if (strokeStyle) {
      this.context.strokeStyle = strokeStyle;
    }

    this.context.beginPath();
    this.context.moveTo(fromPosition.x, fromPosition.y);
    this.context.lineTo(toPosition.x, toPosition.y);
    this.context.stroke();
  }

  drawDirectedLine(
    fromPosition: Position,
    toPosition: Position,
    lineWidth?: number,
    strokeStyle?: string
  ): void {
    this.drawUndirectedLine(fromPosition, toPosition, lineWidth, strokeStyle);
    const positionDivInRatio = fromPosition.divideInRatio(this.ratio, toPosition);
    this.drawArrow(fromPosition, toPosition, positionDivInRatio);
  }

  drawCircle(position: Position, radius: number, textInside: string, color?: string): void {
    this.context.beginPath();
    this.context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    this.context.fillStyle = color || '#00f';
    this.context.fill();

    this.context.font = this.fontSize + 'pt Open Sans';
    this.context.fillStyle = '#fff';
    this.context.textAlign = 'center';
    this.context.fillText(textInside, position.x, position.y + this.fontSize / 2);
  }

  drawEdges(edges: UndirectedEdge[]): void {
    const generateShift = createEdgeShiftGenerator(edges.length);

    edges.forEach(edge => {
      const vertices = edge.getVertices();
      const fromX = vertices[0].getPosition()!.x;
      const fromY = vertices[0].getPosition()!.y;
      const toX = vertices[1].getPosition()!.x;
      const toY = vertices[1].getPosition()!.y;

      this.context.beginPath();
      this.context.moveTo(fromX, fromY);
      let shiftX = (fromX + toX) / 2;
      let shiftY = (fromY + toY) / 2;
      shiftY += generateShift();
      this.context.quadraticCurveTo(shiftX, shiftY, toX, toY);
      this.context.stroke();

      if (edge instanceof DirectedEdge) {
        this.context.beginPath();
        const arrowStartPosition = new Position(
          getQuadraticCurveCoord(this.ratio, fromX, shiftX, toX),
          getQuadraticCurveCoord(this.ratio, fromY, shiftY, toY)
        );
        this.drawArrow(vertices[0].getPosition()!, vertices[1].getPosition()!, arrowStartPosition);
      }
    });
  }

  /**
   * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82#.D0.9F.D0.BE.D0.B2.D0.BE.D1.80.D0.BE.D1.82_.D0.B2_.D0.B4.D0.B2.D1.83.D0.BC.D0.B5.D1.80.D0.BD.D0.BE.D0.BC_.D0.BF.D1.80.D0.BE.D1.81.D1.82.D1.80.D0.B0.D0.BD.D1.81.D1.82.D0.B2.D0.B5
   */
  private drawArrow(fromPosition: Position, toPosition: Position, arrowStartPosition: Position) {
    const fromX = fromPosition.x;
    const fromY = fromPosition.y;
    const toX = toPosition.x;
    const toY = toPosition.y;

    const angle = Math.atan2(toY - fromY, toX - fromX);
    const rotationAngle = Math.PI / 6;

    const { x, y } = arrowStartPosition;

    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(
      x - this.arrowLength * Math.cos(angle - rotationAngle),
      y - this.arrowLength * Math.sin(angle - rotationAngle)
    );
    this.context.moveTo(x, y);
    this.context.lineTo(
      x - this.arrowLength * Math.cos(angle + rotationAngle),
      y - this.arrowLength * Math.sin(angle + rotationAngle)
    );
    this.context.stroke();
  }
}
