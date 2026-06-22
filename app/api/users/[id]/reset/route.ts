import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const TOKEN_TTL_MINUTES = 60;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** POST /api/users/[id]/reset – Admin generates a password reset link for a user */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Invalidate any existing pending tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: id,
        tokenHash: hashToken(token),
        expiresAt,
      },
    });

    const resetUrl = `${request.nextUrl.origin}/auth/reset-password?token=${token}`;
    return NextResponse.json({ success: true, resetUrl });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin reset error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

/** DELETE /api/users/[id]/reset – Admin rejects/invalidates all pending reset tokens */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.passwordResetToken.updateMany({
      where: { userId: id, usedAt: null },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin reject reset error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
