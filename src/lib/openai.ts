import OpenAI from "openai";
import type {
  InterviewQuestion,
  InterviewEvaluation,
  ResumeAnalysisResult,
} from "@/types";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function parseJson<T>(content: string): T {
  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export async function generateInterviewQuestions(params: {
  name: string;
  jobRole: string;
  experience: string;
  skills: string[];
  resumeText?: string;
  companyStyle?: string;
  mode?: string;
  count?: number;
}): Promise<InterviewQuestion[]> {
  const count = params.count ?? 8;
  const prompt = `You are an expert technical interviewer. Generate ${count} personalized interview questions for:
- Candidate: ${params.name}
- Role: ${params.jobRole}
- Experience: ${params.experience}
- Skills: ${params.skills.join(", ")}
${params.resumeText ? `- Resume excerpt: ${params.resumeText.slice(0, 2000)}` : ""}
${params.companyStyle ? `- Interview style: ${params.companyStyle} (mimic their interview culture)` : ""}
${params.mode === "coding" ? "- Include 2 coding/algorithm questions" : ""}

Return JSON array with exactly ${count} objects:
[{"id":"q1","type":"technical|behavioral|situational|hr","question":"...","followUpHints":["..."]}]

Mix: ~40% technical, ~25% behavioral, ~20% situational, ~15% HR.
Make questions specific to their role and resume.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Return only valid JSON array, no markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content ?? "[]";
  return parseJson<InterviewQuestion[]>(content);
}

export async function generateFollowUpQuestion(params: {
  originalQuestion: string;
  answer: string;
  jobRole: string;
}): Promise<string | null> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "If the answer warrants a follow-up, return JSON {\"followUp\":\"question\"}. Otherwise return {\"followUp\":null}. One concise follow-up only.",
      },
      {
        role: "user",
        content: `Role: ${params.jobRole}\nQ: ${params.originalQuestion}\nA: ${params.answer}`,
      },
    ],
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = parseJson<{ followUp: string | null }>(content);
  return parsed.followUp;
}

export async function evaluateInterview(params: {
  jobRole: string;
  experience: string;
  questions: InterviewQuestion[];
  answers: { questionId: string; answer: string }[];
}): Promise<InterviewEvaluation> {
  const qa = params.questions
    .map((q) => {
      const a = params.answers.find((x) => x.questionId === q.id)?.answer ?? "";
      return `Q (${q.type}): ${q.question}\nA: ${a}`;
    })
    .join("\n\n");

  const prompt = `Evaluate this mock interview for ${params.jobRole} (${params.experience} level).

${qa}

Return JSON:
{
  "overallScore": 0-100,
  "communication": 0-100,
  "technical": 0-100,
  "confidence": 0-100,
  "problemSolving": 0-100,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."],
  "roadmap": [{"week":1,"focus":"...","actions":["..."]}],
  "summary": "2-3 sentence overall feedback"
}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Return only valid JSON, no markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return parseJson<InterviewEvaluation>(content);
}

export async function analyzeResume(params: {
  resumeText: string;
  targetRole: string;
}): Promise<ResumeAnalysisResult> {
  const prompt = `Analyze this resume for ATS compatibility targeting ${params.targetRole}.

Resume:
${params.resumeText.slice(0, 6000)}

Return JSON:
{
  "atsScore": 0-100,
  "missingSkills": ["..."],
  "improvements": ["..."],
  "keywords": ["..."],
  "sections": {"summary":"brief assessment","experience":"...","skills":"..."}
}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Return only valid JSON, no markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return parseJson<ResumeAnalysisResult>(content);
}

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
