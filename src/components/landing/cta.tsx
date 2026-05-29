"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-cyan-600/10 p-12 text-center backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to land your dream job?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Start your first mock interview in under 2 minutes. No credit card required.
        </p>
        <Link href="/setup" className="mt-8 inline-block">
          <Button size="lg" className="group">
            Start Interview
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
