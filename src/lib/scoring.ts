export const GAME_CONFIG = {
  TOTAL_TIME: 10,
  MAX_LIVES: 3,
  TOTAL_ROUNDS: 10,
  BASE_SCORE: 100,
  MAX_TIME_BONUS: 200,
  STREAK_BONUS: 50,
  STREAK_THRESHOLD: 3,
  FEEDBACK_DURATION: 2300,
} as const;

export function calculateScore(timeRemaining: number): number {
  const ratio = timeRemaining / GAME_CONFIG.TOTAL_TIME;
  return GAME_CONFIG.BASE_SCORE + Math.round(ratio * GAME_CONFIG.MAX_TIME_BONUS);
}

export function getSpeedLabel(timeRemaining: number): { label: string; color: string } {
  const ratio = timeRemaining / GAME_CONFIG.TOTAL_TIME;
  if (ratio > 0.7) return { label: "LIGHTNING FAST", color: "text-yellow-300" };
  if (ratio > 0.5) return { label: "Quick", color: "text-green-400" };
  if (ratio > 0.3) return { label: "Good", color: "text-blue-400" };
  return { label: "Just in time", color: "text-gray-400" };
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}
