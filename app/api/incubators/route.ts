import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const incubators = await prisma.incubator.findMany({
      select: {
        id: true,
        code: true,
        ward: true,
        status: true,
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json(incubators);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Incubators list error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}