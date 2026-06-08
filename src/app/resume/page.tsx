"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { JOB_ROLES } from "@/types";
import type { ResumeAnalysisResult } from "@/types";
import { extractTextFromFile } from "@/lib/resume-file";

export default function ResumePage() {
  const [targetRole, setTargetRole] = useState<string>(JOB_ROLES[0]);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const analyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Upload a resume or paste your resume text");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole }),
      });
      const data = await res.json();
      setResult(data);
      toast.success("Resume analyzed successfully");
    } catch {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    setExtracting(true);
    setFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text.slice(0, 12000));
      toast.success(
        file.name.toLowerCase().endsWith(".pdf")
          ? "PDF uploaded — text extracted successfully"
          : "Resume uploaded successfully"
      );
    } catch (err) {
      setFileName(null);
      toast.error(err instanceof Error ? err.message : "Failed to read file");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Resume Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          ATS score, missing skills, and improvement suggestions
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>PDF or paste text for ATS analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Target Role</label>
            <Select
              className="mt-1.5"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              {JOB_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-8 hover:border-violet-500/50 dark:border-zinc-600">
            {extracting ? (
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-violet-500" />
            ) : (
              <Upload className="mb-2 h-8 w-8 text-zinc-500" />
            )}
            <span className="text-sm text-zinc-900 dark:text-zinc-50">
              {extracting
                ? "Extracting text from PDF..."
                : fileName ?? "Upload PDF or TXT"}
            </span>
            <span className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Max 5MB</span>
            <input
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              className="hidden"
              disabled={extracting}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </label>

          <textarea
            className="min-h-[200px] w-full rounded-xl border border-zinc-300 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400"
            placeholder="Or paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <Button onClick={analyze} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-8 text-center">
            <div className="text-5xl font-bold gradient-text">{result.atsScore}</div>
            <p className="mt-1 text-muted-foreground">ATS Compatibility Score</p>
            <Progress value={result.atsScore} className="mx-auto mt-4 max-w-md" />
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Missing Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.missingSkills.map((s) => (
                  <Badge key={s} variant="warning">
                    {s}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keyword Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.keywords.map((k) => (
                  <Badge key={k} variant="secondary">
                    {k}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.improvements.map((imp) => (
                  <li key={imp} className="text-sm text-muted-foreground">
                    • {imp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {result.sections && (
            <Card>
              <CardHeader>
                <CardTitle>Section Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(result.sections).map(([key, value]) => (
                  <div key={key}>
                    <p className="font-medium capitalize">{key}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
