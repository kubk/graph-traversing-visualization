export class Position {
  constructor(public readonly x: number, public readonly y: number) {}

  isInCircle(circlePosition: Position, circleRadius: number): boolean {
    return (this.x - circlePosition.x) ** 2 + (this.y - circlePosition.y) ** 2 <= circleRadius ** 2;
  }

  /**
   * Calculates position of the point that divides the line in a given ratio
   */
  divideInRatio(ratio: number, toPosition: Position): Position {
    return new Position(
      (this.x + ratio * toPosition.x) / (1 + ratio),
      (this.y + ratio * toPosition.y) / (1 + ratio)
    );
  }
}
