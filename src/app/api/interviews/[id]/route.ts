import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/memory-store";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const memory = memoryStore.getInterview(id);
  if (memory) {
    return NextResponse.json({
      id: memory.id,
      questions: memory.questions,
      answers: memory.answers,
      status: memory.status,
      jobRole: memory.jobRole,
    });
  }

  try {
    const interview = await prisma.interview.findUnique({ where: { id } });
    if (!interview) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: interview.id,
      questions: interview.questions,
      answers: interview.answers,
      status: interview.status,
      jobRole: interview.jobRole,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
