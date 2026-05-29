import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db-user";
import { memoryStore } from "@/lib/memory-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getOrCreateUser();
    const userId = user?.id ?? "anonymous";

    let interviews: {
      id: string;
      title: string;
      jobRole: string;
      overallScore: number | null;
      createdAt: string;
    }[] = [];

    let gamification = {
      xp: user && "xp" in user ? user.xp : 0,
      level: user && "level" in user ? user.level : 1,
      streak: user && "streak" in user ? user.streak : 0,
      badges: user && "badges" in user ? user.badges : [],
    };

    try {
      if (user && "clerkId" in user) {
        const dbInterviews = await prisma.interview.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 20,
        });
        interviews = dbInterviews.map((i) => ({
          id: i.id,
          title: i.title,
          jobRole: i.jobRole,
          overallScore: i.overallScore,
          createdAt: i.createdAt.toISOString(),
        }));
      }
    } catch {
      /* fallback */
    }

    if (interviews.length === 0) {
      const memory = memoryStore.getUserInterviews(userId);
      interviews = memory.map((i) => ({
        id: i.id,
        title: i.title,
        jobRole: i.jobRole,
        overallScore: i.overallScore ?? null,
        createdAt: i.createdAt,
      }));
    }

    const scoreTrend = interviews
      .filter((i) => i.overallScore != null)
      .reverse()
      .map((i) => ({
        date: new Date(i.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: i.overallScore!,
      }));

    return NextResponse.json({
      interviews,
      gamification,
      scoreTrend,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      interviews: [],
      gamification: { xp: 0, level: 1, streak: 0, badges: [] },
      scoreTrend: [],
    });
  }
}
