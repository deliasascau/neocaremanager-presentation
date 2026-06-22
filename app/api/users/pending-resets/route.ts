import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const tokens = await prisma.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: now },
      },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tokens);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Pending resets error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
