import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db-user";
import { evaluateInterview, hasOpenAI } from "@/lib/openai";
import { getMockEvaluation } from "@/lib/mock-data";
import {
  calculateXpEarned,
  applyXp,
  checkNewBadges,
  updateStreak,
} from "@/lib/gamification";
import { memoryStore } from "@/lib/memory-store";
import { prisma } from "@/lib/prisma";
import type { InterviewQuestion } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { questions, answers, jobRole, experience, durationSeconds, mode } = body;

    let evaluation;
    if (hasOpenAI()) {
      evaluation = await evaluateInterview({
        jobRole,
        experience,
        questions: questions as InterviewQuestion[],
        answers,
      });
    } else {
      evaluation = getMockEvaluation();
    }

    const xpEarned = calculateXpEarned(
      evaluation.overallScore,
      (questions as InterviewQuestion[]).length
    );

    const user = await getOrCreateUser();
    const userId = user?.id ?? "anonymous";

    memoryStore.updateInterview(id, {
      answers,
      status: "completed",
      overallScore: evaluation.overallScore,
      evaluation,
      xpEarned,
      durationSeconds,
    });

    let gamification = {
      xp: (user && "xp" in user ? user.xp : 0) + xpEarned,
      level: user && "level" in user ? user.level : 1,
      streak: user && "streak" in user ? user.streak : 0,
      badges: user && "badges" in user ? [...user.badges] : [],
    };

    if (user && "clerkId" in user) {
      try {
        const lastActive =
          "lastActiveAt" in user && user.lastActiveAt
            ? user.lastActiveAt.toISOString()
            : null;
        const streakUpdate = updateStreak(lastActive);
        const interviewCount = await prisma.interview.count({
          where: { userId: user.id, status: "completed" },
        });

        const badges = checkNewBadges({
          badges: user.badges,
          interviewCount: interviewCount + 1,
          streak: user.streak + streakUpdate.streak,
          latestScore: evaluation.overallScore,
          codingMode: mode === "coding",
        });

        const updated = await prisma.user.update({
          where: { id: user.id },
          data: {
            xp: user.xp + xpEarned,
            level: Math.floor((user.xp + xpEarned) / 500) + 1,
            streak:
              streakUpdate.streak > 0 ? user.streak + 1 : user.streak || 1,
            lastActiveAt: new Date(),
            badges,
          },
        });

        gamification = {
          xp: updated.xp,
          level: updated.level,
          streak: updated.streak,
          badges: updated.badges,
        };

        await prisma.interview.update({
          where: { id },
          data: {
            status: "completed",
            answers,
            overallScore: evaluation.overallScore,
            communication: evaluation.communication,
            technical: evaluation.technical,
            confidence: evaluation.confidence,
            problemSolving: evaluation.problemSolving,
            evaluation: evaluation as object,
            xpEarned,
            durationSeconds: durationSeconds ?? 0,
          },
        });
      } catch {
        gamification = applyXp(
          { xp: gamification.xp, level: gamification.level, streak: gamification.streak, badges: gamification.badges },
          xpEarned
        );
      }
    } else {
      gamification = applyXp(
        { xp: 0, level: 1, streak: 0, badges: [] },
        xpEarned
      );
    }

    return NextResponse.json({ evaluation, xpEarned, gamification });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
