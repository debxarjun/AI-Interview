import Link from "next/link";
import { Mic2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
            <Mic2 className="h-4 w-4" />
          </span>
          <span className="font-semibold">InterviewAI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} InterviewAI. Built for job seekers worldwide.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/setup" className="hover:text-foreground">
            Start Interview
          </Link>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
