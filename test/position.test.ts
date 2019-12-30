import { Position } from '../src/model/position';

describe('Position', () => {
  it('returns valid x and y', () => {
    const p = new Position(1, 2);

    expect(1).toEqual(p.getX());
    expect(2).toEqual(p.getY());
  });
});
