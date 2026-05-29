import { NextResponse } from "next/server";
import { generateFollowUpQuestion, hasOpenAI } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { question, answer, jobRole } = await req.json();
    if (!question || !answer) {
      return NextResponse.json({ followUp: null });
    }

    if (!hasOpenAI()) {
      if (answer.length < 80) {
        return NextResponse.json({
          followUp: "Can you elaborate with a specific example?",
        });
      }
      return NextResponse.json({ followUp: null });
    }

    const followUp = await generateFollowUpQuestion({
      originalQuestion: question,
      answer,
      jobRole: jobRole ?? "Developer",
    });

    return NextResponse.json({ followUp });
  } catch {
    return NextResponse.json({ followUp: null });
  }
}
