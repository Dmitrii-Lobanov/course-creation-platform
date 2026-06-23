export function getNextPosition(items: Array<{ position: number }>): number {
  if (items.length === 0) {
    return 1;
  }

  return Math.max(...items.map((item) => item.position)) + 1;
}
