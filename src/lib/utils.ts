import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function xpForLevel(level: number): number {
  return level * 500;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let needed = 500;
  let remaining = xp;
  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = level * 500;
  }
  return level;
}
