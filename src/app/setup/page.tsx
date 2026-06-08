"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useInterviewStore } from "@/hooks/use-interview-store";
import { JOB_ROLES, EXPERIENCE_LEVELS, COMPANY_STYLES } from "@/types";
import { cn } from "@/lib/utils";
import { extractTextFromFile } from "@/lib/resume-file";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  jobRole: z.string().min(1, "Select a role"),
  experience: z.string().min(1, "Select experience level"),
});

type FormData = z.infer<typeof schema>;

export default function SetupPage() {
  const router = useRouter();
  const setProfile = useInterviewStore((s) => s.setProfile);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [companyStyle, setCompanyStyle] = useState("standard");
  const [mode, setMode] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [extractingResume, setExtractingResume] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { jobRole: JOB_ROLES[0], experience: EXPERIENCE_LEVELS[0] },
  });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skillTags.includes(skill) && skillTags.length < 15) {
      const updated = [...skillTags, skill];
      setSkillTags(updated);
      setValue("skills", updated.join(", "));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const updated = skillTags.filter((s) => s !== skill);
    setSkillTags(updated);
    setValue("skills", updated.join(", "));
  };

  const handleResume = async (file: File) => {
    setExtractingResume(true);
    setResumeFile(file);
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text.slice(0, 8000));
      toast.success(
        file.name.toLowerCase().endsWith(".pdf")
          ? "PDF uploaded — text extracted successfully"
          : "Resume uploaded successfully"
      );
    } catch (err) {
      setResumeFile(null);
      toast.error(err instanceof Error ? err.message : "Failed to read file");
    } finally {
      setExtractingResume(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (skillTags.length === 0) {
      toast.error("Add at least one skill — type a skill and click Add");
      return;
    }

    if (extractingResume) {
      toast.error("Please wait for resume extraction to finish");
      return;
    }

    setLoading(true);
    const profile = {
      name: data.name,
      jobRole: data.jobRole,
      experience: data.experience,
      skills: skillTags,
      resumeText: resumeText || undefined,
      resumeUrl: resumeFile ? resumeFile.name : undefined,
    };

    setProfile(profile);

    try {
      const res = await fetch("/api/interviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          companyStyle,
          mode,
        }),
      });

      const interview = await res.json();
      if (!res.ok) {
        throw new Error(interview.error ?? "Failed to generate interview");
      }
      useInterviewStore.getState().setInterview({
        id: interview.id,
        questions: interview.questions,
        companyStyle,
        mode,
      });

      sessionStorage.setItem("interview-profile", JSON.stringify(profile));
      sessionStorage.setItem(
        `interview-${interview.id}`,
        JSON.stringify({ questions: interview.questions, companyStyle, mode })
      );
      router.push(`/interview/${interview.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Set Up Your Interview</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about yourself so we can personalize your mock interview
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Basic information for question generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" className="mt-1.5" {...register("name")} />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="jobRole">Job Role</Label>
                  <Select id="jobRole" className="mt-1.5" {...register("jobRole")}>
                    {JOB_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select id="experience" className="mt-1.5" {...register("experience")}>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label>Skills</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    placeholder="e.g. React, TypeScript"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                {skillTags.length === 0 && (
                  <p className="mt-1 text-sm text-zinc-500">
                    Type a skill above and click Add
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {skillTags.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Resume (PDF)</Label>
                <label
                  className={cn(
                    "mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 p-8 transition-colors hover:border-violet-500/50 hover:bg-white/5",
                    resumeFile && "border-violet-500/50 bg-violet-500/5"
                  )}
                >
                  {extractingResume ? (
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-violet-500" />
                  ) : (
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {extractingResume
                      ? "Extracting text from PDF..."
                      : resumeFile
                        ? resumeFile.name
                        : "Click to upload PDF or TXT resume"}
                  </span>
                  <span className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Max 5MB</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,application/pdf,text/plain"
                    className="hidden"
                    disabled={extractingResume}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleResume(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interview Style</CardTitle>
              <CardDescription>Choose company style and interview mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {COMPANY_STYLES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCompanyStyle(c.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      companyStyle === c.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <div className="mt-2 font-medium">{c.name}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                {[
                  { id: "standard", label: "Standard" },
                  { id: "coding", label: "Coding Mode" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex-1 rounded-xl border py-3 font-medium transition-all",
                      mode === m.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading || extractingResume || skillTags.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Start Interview"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
