/**
 * @param {number} edgesCount
 * @param {number} minDistance
 * @return {Function} Callback that generates shift for the next parallel edge
 */
export function createEdgeShiftGenerator(edgesCount: number, minDistance = 50): () => number {
  if (edgesCount < 1) {
    throw new Error('Edge count must be positive');
  }

  let shift = edgesCount % 2 === 0 ? minDistance : 0;

  return () => {
    const oldShift = shift;
    if (shift > 0) {
      shift *= -1;
    } else {
      shift = Math.abs(shift) + minDistance;
    }
    return oldShift;
  };
}
