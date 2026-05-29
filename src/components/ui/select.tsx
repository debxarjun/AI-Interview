import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    className={cn(
      "flex h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
      "dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
