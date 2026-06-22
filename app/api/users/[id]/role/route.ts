import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VALID_ROLES = ["ADMIN", "DOCTOR", "ASSISTANT", "MOTHER"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { role } = await request.json();

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` },
        { status: 400 }
      );
    }

    // Check user exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Update role
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });

    // Create the corresponding profile record if it doesn't exist
    if (role === "MOTHER") {
      await prisma.mother.upsert({
        where: { userId: id },
        update: {},
        create: { userId: id },
      });
    } else if (role === "DOCTOR") {
      await prisma.doctor.upsert({
        where: { userId: id },
        update: {},
        create: { userId: id },
      });
    } else if (role === "ASSISTANT") {
      await prisma.assistant.upsert({
        where: { userId: id },
        update: {},
        create: { userId: id },
      });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}