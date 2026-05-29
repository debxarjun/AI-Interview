"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-600 dark:text-violet-300">
            <Sparkles className="h-4 w-4" />
            AI-Powered Interview Coach
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Practice Interviews.{" "}
          <span className="gradient-text">Build Confidence.</span>
          <br />
          Get Hired.
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Personalized mock interviews with voice mode, real-time feedback, resume
          analysis, and company-style questions from Google, Amazon, and more.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/setup">
            <Button size="lg" className="group min-w-[200px]">
              Start Interview
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              <Play className="h-4 w-4" />
              View Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="surface-panel mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 sm:gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { value: "10K+", label: "Interviews" },
            { value: "92%", label: "Feel More Confident" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
