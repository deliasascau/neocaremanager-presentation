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
        ward: { select: { name: true } },
        status: true,
        admissions: {
          where: { dischargedAt: null },
          select: { id: true },
        },
      },
      orderBy: { code: "asc" },
    });

    // Auto-heal: if status in DB is out of sync with actual active admissions, fix it
    const toFix = incubators.filter((inc) => {
      const hasActive = inc.admissions.length > 0;
      return (hasActive && inc.status === "AVAILABLE") ||
             (!hasActive && inc.status === "OCCUPIED");
    });

    if (toFix.length > 0) {
      await Promise.all(
        toFix.map((inc) =>
          prisma.incubator.update({
            where: { id: inc.id },
            data: { status: inc.admissions.length > 0 ? "OCCUPIED" : "AVAILABLE" },
          })
        )
      );
    }

    return NextResponse.json(
      incubators.map((incubator) => ({
        id: incubator.id,
        code: incubator.code,
        ward: incubator.ward.name,
        // Use real computed status, not the potentially stale DB value
        status: incubator.admissions.length > 0 ? "OCCUPIED" : incubator.status,
      }))
    );
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
