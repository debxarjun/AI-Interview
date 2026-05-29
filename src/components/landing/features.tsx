"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Brain,
  BarChart3,
  FileText,
  Trophy,
  Building2,
  Code2,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Generated Questions",
    description:
      "Personalized technical, behavioral, situational, and HR questions based on your resume and target role.",
  },
  {
    icon: Mic,
    title: "Voice Interview Mode",
    description:
      "Text-to-speech questions with speech-to-text answers. Practice like a real video interview.",
  },
  {
    icon: BarChart3,
    title: "Detailed Evaluation",
    description:
      "Scores across communication, technical knowledge, confidence, and problem-solving with actionable feedback.",
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description:
      "ATS score, missing skills, keyword suggestions, and improvement tips tailored to your job role.",
  },
  {
    icon: Building2,
    title: "Company Mock Interviews",
    description:
      "Practice Google, Microsoft, Amazon, Meta, and Apple-style interview patterns.",
  },
  {
    icon: Code2,
    title: "Coding Interview Mode",
    description:
      "Algorithm and system design questions for software engineering roles.",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description:
      "Earn XP, unlock badges, maintain streaks, and level up as you improve.",
  },
  {
    icon: Camera,
    title: "Confidence Detection",
    description:
      "Optional camera-based confidence tracking during your interview session.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need to <span className="gradient-text">ace your interview</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A complete interview preparation platform built for students and job seekers.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full transition-transform hover:scale-[1.02] hover:border-violet-500/30">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                    <feature.icon className="h-6 w-6 text-violet-500" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
