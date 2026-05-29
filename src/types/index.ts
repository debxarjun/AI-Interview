export type QuestionType = "technical" | "behavioral" | "situational" | "hr";

export interface InterviewQuestion {
  id: string;
  type: QuestionType;
  question: string;
  followUpHints?: string[];
  isFollowUp?: boolean;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  timestamp: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  communication: number;
  technical: number;
  confidence: number;
  problemSolving: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  roadmap: { week: number; focus: string; actions: string[] }[];
  summary: string;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  missingSkills: string[];
  improvements: string[];
  keywords: string[];
  sections?: Record<string, string>;
}

export interface UserProfile {
  name: string;
  jobRole: string;
  experience: string;
  skills: string[];
  resumeUrl?: string;
  resumeText?: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

export const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Mobile Developer",
  "QA Engineer",
] as const;

export const EXPERIENCE_LEVELS = ["Fresher", "Intermediate", "Experienced"] as const;

export const COMPANY_STYLES = [
  { id: "standard", name: "Standard", icon: "🎯" },
  { id: "google", name: "Google", icon: "🔍" },
  { id: "microsoft", name: "Microsoft", icon: "🪟" },
  { id: "amazon", name: "Amazon", icon: "📦" },
  { id: "meta", name: "Meta", icon: "👤" },
  { id: "apple", name: "Apple", icon: "🍎" },
] as const;

export const BADGES = [
  { id: "first_interview", name: "First Steps", description: "Complete your first interview", icon: "🎉" },
  { id: "streak_3", name: "On Fire", description: "3-day interview streak", icon: "🔥" },
  { id: "streak_7", name: "Unstoppable", description: "7-day streak", icon: "⚡" },
  { id: "score_80", name: "High Achiever", description: "Score 80+ on an interview", icon: "🏆" },
  { id: "score_90", name: "Elite", description: "Score 90+ on an interview", icon: "💎" },
  { id: "five_interviews", name: "Dedicated", description: "Complete 5 interviews", icon: "📚" },
  { id: "coding_mode", name: "Code Warrior", description: "Complete a coding interview", icon: "💻" },
  { id: "resume_pro", name: "Resume Pro", description: "Analyze your resume", icon: "📄" },
] as const;
