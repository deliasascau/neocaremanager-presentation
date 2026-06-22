import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const [totalPatients, activeAdmissions, incubators, unsolvedAlerts] = await Promise.all([
      prisma.patient.count(),
      prisma.admission.count({ where: { dischargedAt: null } }),
      prisma.incubator.findMany({ select: { status: true } }),
      prisma.alert.count({ where: { resolved: false } }),
    ]);

    const availableIncubators = incubators.filter((i) => i.status === "AVAILABLE").length;
    const occupiedIncubators = incubators.filter((i) => i.status === "OCCUPIED").length;
    const totalIncubators = incubators.length;

    return NextResponse.json({
      totalPatients,
      activeAdmissions,
      availableIncubators,
      occupiedIncubators,
      totalIncubators,
      unsolvedAlerts,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}