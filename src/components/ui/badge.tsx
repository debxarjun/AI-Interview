import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-violet-500/20 text-violet-700 dark:text-violet-300",
        secondary: "border-transparent bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        outline: "border-white/20 text-foreground",
        success: "border-transparent bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
        warning: "border-transparent bg-amber-500/20 text-amber-700 dark:text-amber-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
