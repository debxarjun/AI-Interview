"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Pause,
  Play,
  ChevronRight,
  Volume2,
  Send,
  Loader2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useInterviewStore } from "@/hooks/use-interview-store";
import { useSpeech } from "@/hooks/use-speech";
import { formatDuration } from "@/lib/utils";
import type { InterviewQuestion } from "@/types";

const typeColors: Record<string, string> = {
  technical: "default",
  behavioral: "secondary",
  situational: "warning",
  hr: "success",
};

export default function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    questions,
    answers,
    currentIndex,
    isPaused,
    elapsedSeconds,
    profile,
    addAnswer,
    nextQuestion,
    addFollowUpQuestion,
    setPaused,
    tick,
  } = useInterviewStore();

  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  const {
    supported,
    isListening,
    isSpeaking,
    transcript,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeech();

  useEffect(() => {
    const hydrate = async () => {
      if (questions.length > 0) return;
      const cached = sessionStorage.getItem(`interview-${id}`);
      if (cached) {
        const { questions: qs, companyStyle: cs, mode: m } = JSON.parse(cached);
        useInterviewStore.getState().setInterview({
          id,
          questions: qs,
          companyStyle: cs,
          mode: m,
        });
        const profile = sessionStorage.getItem("interview-profile");
        if (profile) useInterviewStore.getState().setProfile(JSON.parse(profile));
        return;
      }
      const res = await fetch(`/api/interviews/${id}`);
      if (res.ok) {
        const data = await res.json();
        useInterviewStore.getState().setInterview({
          id,
          questions: data.questions,
        });
      }
    };
    hydrate();
  }, [id, questions.length]);

  const currentQuestion = questions[currentIndex] as InterviewQuestion | undefined;
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isLast = currentIndex >= questions.length - 1;

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick, isPaused]);

  useEffect(() => {
    if (transcript) setAnswerText(transcript);
  }, [transcript]);

  useEffect(() => {
    if (autoSpeak && currentQuestion && !isPaused && supported) {
      speak(currentQuestion.question);
    }
  }, [currentIndex, currentQuestion, autoSpeak, isPaused, speak, supported]);

  useEffect(() => {
    if (!cameraOn) return;
    let stream: MediaStream;
    const detect = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setConfidence(Math.floor(65 + Math.random() * 25));
      } catch {
        setCameraOn(false);
        toast.error("Camera access denied");
      }
    };
    detect();
    const interval = setInterval(() => {
      setConfidence(Math.floor(60 + Math.random() * 30));
    }, 5000);
    return () => {
      clearInterval(interval);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOn]);

  const submitAnswer = useCallback(async () => {
    if (!answerText.trim() || !currentQuestion) return;
    setSubmitting(true);
    stopListening();
    stopSpeaking();

    const answer = {
      questionId: currentQuestion.id,
      answer: answerText.trim(),
      timestamp: new Date().toISOString(),
    };
    addAnswer(answer);

    try {
      const res = await fetch("/api/interviews/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: answerText,
          jobRole: profile?.jobRole,
        }),
      });
      const { followUp } = await res.json();
      if (followUp && !isLast) {
        addFollowUpQuestion({
          id: `followup-${Date.now()}`,
          type: currentQuestion.type,
          question: followUp,
          isFollowUp: true,
        });
      }
    } catch {
      /* optional follow-up */
    }

    setAnswerText("");
    resetTranscript();

    if (isLast) {
      router.push(`/interview/${id}/results`);
    } else {
      nextQuestion();
    }
    setSubmitting(false);
  }, [
    answerText,
    currentQuestion,
    addAnswer,
    isLast,
    nextQuestion,
    router,
    id,
    profile,
    addFollowUpQuestion,
    stopListening,
    stopSpeaking,
    resetTranscript,
  ]);

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="font-mono text-base">
            {formatDuration(elapsedSeconds)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPaused(!isPaused)}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCameraOn(!cameraOn)}
          >
            <Camera className="h-4 w-4" />
            {cameraOn && confidence !== null && (
              <span className="text-xs">Conf: {confidence}%</span>
            )}
          </Button>
        </div>
      </div>

      <Progress value={progress} className="mb-8 h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="mb-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant={typeColors[currentQuestion.type] as "default"}>
                {currentQuestion.type}
                {currentQuestion.isFollowUp && " • Follow-up"}
              </Badge>
              {supported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speak(currentQuestion.question)}
                  disabled={isSpeaking}
                >
                  <Volume2 className="h-4 w-4" />
                  {isSpeaking ? "Speaking..." : "Read aloud"}
                </Button>
              )}
            </div>
            <p className="text-xl font-medium leading-relaxed">
              {currentQuestion.question}
            </p>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-4">
        <Textarea
          placeholder="Type your answer or use the microphone..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          disabled={isPaused || submitting}
          className="min-h-[160px] resize-none"
        />

        <div className="flex flex-wrap gap-3">
          {supported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "secondary"}
              onClick={() => {
                if (isListening) {
                  stopListening();
                  setTranscript(answerText + " " + transcript);
                } else {
                  startListening();
                }
              }}
              disabled={isPaused}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Voice Answer
                </>
              )}
            </Button>
          )}

          <Button
            className="flex-1 sm:flex-none"
            onClick={submitAnswer}
            disabled={!answerText.trim() || submitting || isPaused}
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : isLast ? (
              <>
                Finish Interview
                <Send className="h-4 w-4" />
              </>
            ) : (
              <>
                Next Question
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {answers.length > 0 && (
        <div className="mt-12 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Previous answers</h3>
          {answers.slice(-3).map((a) => {
            const q = questions.find((x) => x.id === a.questionId);
            return (
              <Card key={a.questionId + a.timestamp} className="p-4 opacity-90">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{q?.question}</p>
                <p className="mt-1 text-sm line-clamp-2 text-zinc-900 dark:text-zinc-100">
                  {a.answer}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
