"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer @ Startup",
    content:
      "InterviewAI helped me land my first job. The voice mode felt incredibly real, and the feedback was spot-on.",
    avatar: "PS",
  },
  {
    name: "James Chen",
    role: "Data Analyst",
    content:
      "The Google-style mock interview prepared me better than any YouTube video. My confidence score went from 62 to 88 in two weeks.",
    avatar: "JC",
  },
  {
    name: "Maria Garcia",
    role: "Backend Engineer",
    content:
      "Resume analysis alone was worth it. I fixed my ATS issues and started getting more callbacks immediately.",
    avatar: "MG",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Loved by <span className="gradient-text">job seekers</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands preparing for their dream roles
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {t.name}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
