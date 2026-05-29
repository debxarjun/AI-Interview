import { BADGES, type GamificationState } from "@/types";
import { levelFromXp } from "@/lib/utils";

export function calculateXpEarned(overallScore: number, questionCount: number): number {
  const base = 50 + questionCount * 10;
  const bonus = Math.round(overallScore * 0.5);
  return base + bonus;
}

export function applyXp(state: GamificationState, earned: number): GamificationState {
  const xp = state.xp + earned;
  return { ...state, xp, level: levelFromXp(xp) };
}

export function updateStreak(lastActiveAt: string | null): { streak: number; lastActiveAt: string } {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  if (!lastActiveAt) {
    return { streak: 1, lastActiveAt: today };
  }

  const last = new Date(lastActiveAt);
  const lastDate = last.toISOString().split("T")[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDate === today) {
    return { streak: 0, lastActiveAt: today };
  }
  if (lastDate === yesterdayStr) {
    return { streak: 1, lastActiveAt: today };
  }
  return { streak: 1, lastActiveAt: today };
}

export function checkNewBadges(params: {
  badges: string[];
  interviewCount: number;
  streak: number;
  latestScore?: number;
  codingMode?: boolean;
  resumeAnalyzed?: boolean;
}): string[] {
  const earned = new Set(params.badges);
  const check = (id: string, condition: boolean) => {
    if (condition && !earned.has(id)) earned.add(id);
  };

  check("first_interview", params.interviewCount >= 1);
  check("five_interviews", params.interviewCount >= 5);
  check("streak_3", params.streak >= 3);
  check("streak_7", params.streak >= 7);
  check("score_80", (params.latestScore ?? 0) >= 80);
  check("score_90", (params.latestScore ?? 0) >= 90);
  check("coding_mode", Boolean(params.codingMode));
  check("resume_pro", Boolean(params.resumeAnalyzed));

  return Array.from(earned);
}

export function getBadgeInfo(id: string) {
  return BADGES.find((b) => b.id === id);
}
