"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Moon, Sun, Mic2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resume", label: "Resume" },
  { href: "/setup", label: "Interview" },
];

function BaseNavbar({
  isSignedIn = false,
  isLoaded = true,
}: {
  isSignedIn?: boolean;
  isLoaded?: boolean;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isLanding = pathname === "/";
  const showNav = !hasClerk || (isLoaded && isSignedIn);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl",
        isLanding ? "bg-transparent" : "bg-background/80"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
            <Mic2 className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            InterviewAI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {showNav &&
            links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/10",
                  pathname.startsWith(link.href) && "bg-white/10 text-violet-400"
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {hasClerk ? (
            <>
              {isLoaded && !isSignedIn && (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/setup">
                    <Button size="sm">Start Interview</Button>
                  </Link>
                </>
              )}
              {isLoaded && isSignedIn && (
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-9 w-9" },
                  }}
                />
              )}
            </>
          ) : (
            <Link href="/setup">
              <Button size="sm">Start Interview</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function AuthNavbar() {
  const { isSignedIn, isLoaded } = useUser();
  return <BaseNavbar isSignedIn={isSignedIn} isLoaded={isLoaded} />;
}

export function Navbar() {
  if (hasClerk) return <AuthNavbar />;
  return <BaseNavbar />;
}
