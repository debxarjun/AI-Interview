import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getOrCreateUser } from "@/lib/db-user";
import {
  generateInterviewQuestions,
  hasOpenAI,
} from "@/lib/openai";
import { getMockQuestions } from "@/lib/mock-data";
import { memoryStore } from "@/lib/memory-store";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      jobRole,
      experience,
      skills,
      resumeText,
      companyStyle = "standard",
      mode = "standard",
    } = body;

    if (!name || !jobRole || !experience || !skills?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await getOrCreateUser();
    const userId = user?.id ?? "anonymous";

    let questions;
    if (hasOpenAI()) {
      questions = await generateInterviewQuestions({
        name,
        jobRole,
        experience,
        skills,
        resumeText,
        companyStyle: companyStyle !== "standard" ? companyStyle : undefined,
        mode: mode === "coding" ? "coding" : undefined,
      });
    } else {
      questions = getMockQuestions(jobRole, skills);
    }

    const id = uuidv4();
    const title = `${jobRole} Interview`;

    const interviewData = {
      id,
      userId,
      title,
      jobRole,
      experience,
      companyStyle,
      mode,
      questions,
      answers: [],
      status: "in_progress",
      createdAt: new Date().toISOString(),
    };

    memoryStore.saveInterview(interviewData);

    try {
      if (user && "clerkId" in user) {
        await prisma.interview.create({
          data: {
            id,
            userId: user.id,
            title,
            jobRole,
            experience,
            companyStyle,
            mode,
            questions: questions as object,
            answers: [],
          },
        });
        await prisma.profile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            name,
            jobRole,
            experience,
            skills,
            resumeText,
          },
          update: { name, jobRole, experience, skills, resumeText },
        });
      }
    } catch {
      /* memory store is primary fallback */
    }

    return NextResponse.json({ id, questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate interview" }, { status: 500 });
  }
}
