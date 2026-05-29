"use client";

import { create } from "zustand";
import type { InterviewAnswer, InterviewQuestion, UserProfile } from "@/types";

interface InterviewStore {
  profile: UserProfile | null;
  interviewId: string | null;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  currentIndex: number;
  isPaused: boolean;
  companyStyle: string;
  mode: string;
  startedAt: number | null;
  elapsedSeconds: number;
  setProfile: (profile: UserProfile) => void;
  setInterview: (data: {
    id: string;
    questions: InterviewQuestion[];
    companyStyle?: string;
    mode?: string;
  }) => void;
  addAnswer: (answer: InterviewAnswer) => void;
  nextQuestion: () => void;
  addFollowUpQuestion: (question: InterviewQuestion) => void;
  setPaused: (paused: boolean) => void;
  tick: () => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  profile: null,
  interviewId: null,
  questions: [],
  answers: [],
  currentIndex: 0,
  isPaused: false,
  companyStyle: "standard",
  mode: "standard",
  startedAt: null,
  elapsedSeconds: 0,

  setProfile: (profile) => set({ profile }),

  setInterview: ({ id, questions, companyStyle, mode }) =>
    set({
      interviewId: id,
      questions,
      answers: [],
      currentIndex: 0,
      companyStyle: companyStyle ?? "standard",
      mode: mode ?? "standard",
      startedAt: Date.now(),
      elapsedSeconds: 0,
      isPaused: false,
    }),

  addAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  addFollowUpQuestion: (question) =>
    set((state) => {
      const questions = [...state.questions];
      questions.splice(state.currentIndex + 1, 0, question);
      return { questions };
    }),

  setPaused: (isPaused) => set({ isPaused }),

  tick: () => {
    const { isPaused, startedAt } = get();
    if (!isPaused && startedAt) {
      set({ elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000) });
    }
  },

  reset: () =>
    set({
      interviewId: null,
      questions: [],
      answers: [],
      currentIndex: 0,
      isPaused: false,
      startedAt: null,
      elapsedSeconds: 0,
    }),
}));
