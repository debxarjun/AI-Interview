import type { InterviewQuestion, InterviewEvaluation } from "@/types";

export interface MemoryInterview {
  id: string;
  userId: string;
  title: string;
  jobRole: string;
  experience: string;
  companyStyle: string;
  mode: string;
  questions: InterviewQuestion[];
  answers: { questionId: string; answer: string; timestamp: string }[];
  status: string;
  overallScore?: number;
  evaluation?: InterviewEvaluation;
  xpEarned?: number;
  durationSeconds?: number;
  createdAt: string;
}

const interviews = new Map<string, MemoryInterview>();
const userInterviews = new Map<string, string[]>();

export const memoryStore = {
  saveInterview(data: MemoryInterview) {
    interviews.set(data.id, data);
    const list = userInterviews.get(data.userId) ?? [];
    if (!list.includes(data.id)) {
      list.push(data.id);
      userInterviews.set(data.userId, list);
    }
  },

  getInterview(id: string) {
    return interviews.get(id);
  },

  updateInterview(id: string, patch: Partial<MemoryInterview>) {
    const existing = interviews.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    interviews.set(id, updated);
    return updated;
  },

  getUserInterviews(userId: string) {
    const ids = userInterviews.get(userId) ?? [];
    return ids
      .map((id) => interviews.get(id))
      .filter(Boolean) as MemoryInterview[];
  },
};
