import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db-user";
import { analyzeResume, hasOpenAI } from "@/lib/openai";
import { getMockResumeAnalysis } from "@/lib/mock-data";
import { checkNewBadges } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { resumeText, targetRole } = await req.json();

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: "Resume text required" }, { status: 400 });
    }

    const result = hasOpenAI()
      ? await analyzeResume({ resumeText, targetRole })
      : getMockResumeAnalysis(targetRole);

    const user = await getOrCreateUser();
    if (user && "clerkId" in user) {
      try {
        await prisma.resumeAnalysis.create({
          data: {
            userId: user.id,
            atsScore: result.atsScore,
            missingSkills: result.missingSkills,
            improvements: result.improvements,
            keywords: result.keywords,
            analysis: result as object,
          },
        });

        const badges = checkNewBadges({
          badges: user.badges,
          interviewCount: 0,
          streak: user.streak,
          resumeAnalyzed: true,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { badges },
        });
      } catch {
        /* optional persistence */
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
