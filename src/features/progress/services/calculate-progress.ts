export function calculateProgressPercent(
  completedLessons: number,
  totalLessons: number,
): number {
  if (totalLessons <= 0) {
    return 0;
  }

  if (completedLessons <= 0) {
    return 0;
  }

  const safeCompletedLessons = Math.min(completedLessons, totalLessons);

  return Math.round((safeCompletedLessons / totalLessons) * 100);
}