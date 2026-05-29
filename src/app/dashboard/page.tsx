"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Flame, Star, Trophy, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { BADGES } from "@/types";
import { xpForLevel } from "@/lib/utils";

interface InterviewSummary {
  id: string;
  title: string;
  jobRole: string;
  overallScore: number | null;
  createdAt: string;
}

interface DashboardData {
  interviews: InterviewSummary[];
  gamification: {
    xp: number;
    level: number;
    streak: number;
    badges: string[];
  };
  scoreTrend: { date: string; score: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    data?.interviews.filter(
      (i) => roleFilter === "all" || i.jobRole === roleFilter
    ) ?? [];

  const roles = [...new Set(data?.interviews.map((i) => i.jobRole) ?? [])];
  const xpProgress = data
    ? ((data.gamification.xp % xpForLevel(data.gamification.level)) /
        xpForLevel(data.gamification.level)) *
      100
    : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const g = data?.gamification ?? { xp: 0, level: 1, streak: 0, badges: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and improvement</p>
        </div>
        <Link href="/setup">
          <Button>Start Interview</Button>
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Star, label: "Level", value: g.level, sub: `${g.xp} XP` },
          { icon: Flame, label: "Streak", value: `${g.streak} days`, sub: "Keep it going!" },
          { icon: Trophy, label: "Interviews", value: data?.interviews.length ?? 0, sub: "Completed" },
          {
            icon: Trophy,
            label: "Avg Score",
            value:
              filtered.length > 0
                ? Math.round(
                    filtered.reduce((a, i) => a + (i.overallScore ?? 0), 0) /
                      filtered.filter((i) => i.overallScore).length || 0
                  )
                : "—",
            sub: "Last sessions",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
                  <stat.icon className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span>Level {g.level}</span>
            <span>Level {g.level + 1}</span>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.scoreTrend.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-muted-foreground">
                Complete interviews to see your trend
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BADGES.map((badge) => {
                const earned = g.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      earned
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 opacity-40 grayscale"
                    }`}
                    title={badge.description}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="mt-1 text-xs font-medium">{badge.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Interview History</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No interviews yet.{" "}
              <Link href="/setup" className="text-violet-500 hover:underline">
                Start your first one
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((interview) => (
                <Link
                  key={interview.id}
                  href={`/interview/${interview.id}/results`}
                  className="flex items-center justify-between rounded-xl border border-white/10 p-4 transition-colors hover:bg-white/5"
                >
                  <div>
                    <p className="font-medium">{interview.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {interview.jobRole} •{" "}
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {interview.overallScore != null && (
                    <Badge
                      variant={
                        interview.overallScore >= 80 ? "success" : "default"
                      }
                    >
                      {interview.overallScore}%
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
