import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );
}

export async function getAuthUserId(): Promise<string | null> {
  if (!isClerkConfigured()) return null;

  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function getOrCreateUser() {
  const clerkId = await getAuthUserId();
  if (!clerkId) return null;

  try {
    let user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      user = await prisma.user.create({
        data: { clerkId },
      });
    }
    return user;
  } catch {
    return { id: clerkId, clerkId, xp: 0, level: 1, streak: 0, badges: [] as string[] };
  }
}
