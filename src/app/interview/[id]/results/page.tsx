"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Download, Share2, Trophy, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterviewStore } from "@/hooks/use-interview-store";
import type { InterviewEvaluation } from "@/types";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { questions, answers, profile, elapsedSeconds, mode, companyStyle, reset } =
    useInterviewStore();
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/interviews/${id}/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions,
            answers,
            jobRole: profile?.jobRole,
            experience: profile?.experience,
            durationSeconds: elapsedSeconds,
            mode,
            companyStyle,
          }),
        });
        const data = await res.json();
        setEvaluation(data.evaluation);
        setXpEarned(data.xpEarned ?? 0);
      } catch {
        toast.error("Failed to load evaluation");
      } finally {
        setLoading(false);
      }
    };
    if (questions.length && answers.length) run();
  }, [id, questions, answers, profile, elapsedSeconds, mode, companyStyle]);

  const radarData = evaluation
    ? [
        { subject: "Communication", value: evaluation.communication },
        { subject: "Technical", value: evaluation.technical },
        { subject: "Confidence", value: evaluation.confidence },
        { subject: "Problem Solving", value: evaluation.problemSolving },
      ]
    : [];

  const scoreMetrics = evaluation
    ? [
        { label: "Communication", value: evaluation.communication },
        { label: "Technical Knowledge", value: evaluation.technical },
        { label: "Confidence", value: evaluation.confidence },
        { label: "Problem Solving", value: evaluation.problemSolving },
      ]
    : [];

  const exportPdf = async () => {
    if (!evaluation) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("InterviewAI Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Overall Score: ${evaluation.overallScore}/100`, 20, 35);
    doc.text(`Role: ${profile?.jobRole ?? "N/A"}`, 20, 45);
    doc.text("Strengths:", 20, 60);
    evaluation.strengths.forEach((s, i) => doc.text(`• ${s}`, 25, 70 + i * 8));
    doc.save("interview-report.pdf");
    toast.success("Report downloaded");
  };

  const shareLinkedIn = () => {
    if (!evaluation) return;
    const text = encodeURIComponent(
      `I scored ${evaluation.overallScore}/100 on my mock interview with InterviewAI! 🎯 #InterviewPrep #JobSearch`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-12">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p>No evaluation available</p>
        <Link href="/setup">
          <Button>Start New Interview</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="success" className="mb-2">
              Interview Complete
            </Badge>
            <h1 className="text-3xl font-bold">Your Interview Report</h1>
            <p className="mt-1 text-muted-foreground">{profile?.jobRole} • {profile?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={exportPdf}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="secondary" size="sm" onClick={shareLinkedIn}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center p-8 lg:col-span-1">
            <div className="relative">
              <div className="text-6xl font-bold gradient-text">{evaluation.overallScore}</div>
              <div className="text-center text-sm text-muted-foreground">Overall Score</div>
            </div>
            {xpEarned > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-amber-600 dark:text-amber-400">
                <Trophy className="h-4 w-4" />
                +{xpEarned} XP earned
              </div>
            )}
          </Card>

          <Card className="p-6 lg:col-span-2">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Skills Radar</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {scoreMetrics.map((m) => (
            <Card key={m.label} className="p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>{m.label}</span>
                <span className="font-semibold">{m.value}%</span>
              </div>
              <Progress value={m.value} />
            </Card>
          ))}
        </div>

        <p className="mb-8 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          {evaluation.summary}
        </p>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600 dark:text-emerald-400">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {evaluation.strengths.map((s) => (
                  <li key={s} className="flex gap-2 text-sm">
                    <span className="text-emerald-500">✓</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-600 dark:text-amber-400">Areas to Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((w) => (
                  <li key={w} className="flex gap-2 text-sm">
                    <span className="text-amber-500">→</span> {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suggested Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.improvements.map((imp) => (
                <li key={imp} className="text-sm text-muted-foreground">
                  • {imp}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4-Week Learning Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluation.roadmap.map((week) => (
                <div
                  key={week.week}
                  className="rounded-xl border border-white/10 p-4"
                >
                  <div className="font-semibold">
                    Week {week.week}: {week.focus}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {week.actions.map((a) => (
                      <li key={a}>• {a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Link href="/setup" onClick={() => reset()}>
            <Button>
              New Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">View Dashboard</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
