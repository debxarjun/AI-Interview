import type { InterviewQuestion, InterviewEvaluation, ResumeAnalysisResult } from "@/types";

export function getMockQuestions(
  jobRole: string,
  skills: string[]
): InterviewQuestion[] {
  const skill = skills[0] ?? "your stack";
  return [
    {
      id: "q1",
      type: "hr",
      question: `Tell me about yourself and why you're interested in this ${jobRole} position.`,
    },
    {
      id: "q2",
      type: "technical",
      question: `Explain a challenging project where you used ${skill}. What was your specific contribution?`,
    },
    {
      id: "q3",
      type: "behavioral",
      question:
        "Describe a time you disagreed with a teammate. How did you handle it and what was the outcome?",
    },
    {
      id: "q4",
      type: "technical",
      question: `What are the key trade-offs when scaling a ${jobRole.toLowerCase()} application?`,
    },
    {
      id: "q5",
      type: "situational",
      question:
        "Your team is behind on a critical deadline with unclear requirements. What steps do you take?",
    },
    {
      id: "q6",
      type: "behavioral",
      question: "Tell me about a failure. What did you learn and how did you apply it later?",
    },
    {
      id: "q7",
      type: "technical",
      question: "Walk me through how you debug a production issue under pressure.",
    },
    {
      id: "q8",
      type: "hr",
      question: "Where do you see yourself in 3 years, and how does this role fit that path?",
    },
  ];
}

export function getMockEvaluation(): InterviewEvaluation {
  return {
    overallScore: 72,
    communication: 75,
    technical: 68,
    confidence: 70,
    problemSolving: 74,
    strengths: [
      "Clear structure in behavioral answers",
      "Good awareness of trade-offs",
      "Honest reflection on past failures",
    ],
    weaknesses: [
      "Technical answers could include more metrics",
      "Some responses lacked specific examples",
      "Pace was slightly rushed on complex topics",
    ],
    improvements: [
      "Use STAR method consistently for behavioral questions",
      "Quantify impact (%, time saved, users affected)",
      "Practice system design basics for your target role",
      "Record yourself to improve pacing and filler words",
    ],
    roadmap: [
      {
        week: 1,
        focus: "Communication & Structure",
        actions: ["Practice STAR format daily", "Record 3 mock answers"],
      },
      {
        week: 2,
        focus: "Technical Depth",
        actions: ["Review core concepts", "Do 2 timed technical answers"],
      },
      {
        week: 3,
        focus: "Confidence & Delivery",
        actions: ["Mock interview with peer", "Reduce filler words"],
      },
      {
        week: 4,
        focus: "Full Simulation",
        actions: ["Complete 2 full mock interviews", "Review feedback trends"],
      },
    ],
    summary:
      "Solid foundation with room to grow. Focus on specificity and metrics in technical answers while maintaining your clear communication style.",
  };
}

export function getMockResumeAnalysis(role: string): ResumeAnalysisResult {
  return {
    atsScore: 68,
    missingSkills: ["CI/CD", "System Design", "Cloud (AWS/GCP)"],
    improvements: [
      "Add quantified achievements to each role",
      "Include a dedicated Skills section with role-relevant keywords",
      "Use standard section headings (Experience, Education, Skills)",
      "Reduce graphics and tables for ATS compatibility",
    ],
    keywords: [
      role.split(" ")[0],
      "Agile",
      "REST API",
      "Git",
      "Problem Solving",
      "Cross-functional",
    ],
    sections: {
      summary: "Good overview but could be more targeted to the role.",
      experience: "Add metrics and action verbs (led, built, improved).",
      skills: "Align listed skills with job description keywords.",
    },
  };
}
