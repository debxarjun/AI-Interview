"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const hasClerk = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "backdrop-blur-xl border border-white/10",
          },
        }}
      />
    </ThemeProvider>
  );

  if (!hasClerk) return content;

  return <ClerkProvider>{content}</ClerkProvider>;
}
