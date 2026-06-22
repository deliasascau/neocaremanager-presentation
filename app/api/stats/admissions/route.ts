import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 89);
    startDate.setHours(0, 0, 0, 0);

    const admissions = await prisma.admission.findMany({
      where: { admittedAt: { gte: startDate } },
      select: {
        admittedAt: true,
        incubator: { select: { ward: true } },
      },
      orderBy: { admittedAt: "asc" },
    });

    const byDate = new Map<string, { date: string; nicu: number; intermediate: number }>();

    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = date.toISOString().split("T")[0];
      byDate.set(key, { date: key, nicu: 0, intermediate: 0 });
    }

    for (const admission of admissions) {
      const key = admission.admittedAt.toISOString().split("T")[0];
      const row = byDate.get(key);
      if (!row) continue;

      if (admission.incubator.ward.toLowerCase().includes("intermediate")) {
        row.intermediate += 1;
      } else {
        row.nicu += 1;
      }
    }

    return NextResponse.json({
      totalAdmissions: admissions.length,
      chartData: Array.from(byDate.values()),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admissions stats error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
