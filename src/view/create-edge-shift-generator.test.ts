import { createEdgeShiftGenerator } from './create-edge-shift-generator';

describe('create-edge-shift-generator', () => {
  it('should create shift generator', () => {
    const generate = createEdgeShiftGenerator(1, 50);
    expect(generate()).toBe(0);
    expect(generate()).toBe(50);
    expect(generate()).toBe(-50);
    expect(generate()).toBe(100);
    expect(generate()).toBe(-100);
  });
});
