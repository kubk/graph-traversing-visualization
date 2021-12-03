import { Position } from './position';

describe('Position', () => {
  it('returns valid x and y', () => {
    const p = new Position(1, 2);

    expect(1).toBe(p.x);
    expect(2).toBe(p.y);
  });

  it('can be divided in a given ratio', () => {
    const p1 = new Position(0, 0);

    const newPosition = p1.divideInRatio(1 / 2, new Position(18, 0));
    expect(newPosition.x).toBe(6);
    expect(newPosition.y).toBe(0);
  });

  it('can detect is within a circle', () => {
    const p1 = new Position(0, 0);

    expect(p1.isInCircle(new Position(10, 10), 2)).toBeFalsy();
    expect(p1.isInCircle(new Position(10, 10), 100)).toBeTruthy();
  });
});
