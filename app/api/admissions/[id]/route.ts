import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const { id } = await params;

    // Discharge: set dischargedAt and free the incubator
    const admission = await prisma.admission.findUnique({
      where: { id },
      include: { incubator: true },
    });

    if (!admission) {
      return NextResponse.json({ error: "Admission not found." }, { status: 404 });
    }
    if (admission.dischargedAt) {
      return NextResponse.json({ error: "Patient already discharged." }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.admission.update({
        where: { id },
        data: { dischargedAt: new Date() },
      }),
      prisma.incubator.update({
        where: { id: admission.incubatorId },
        data: { status: "AVAILABLE" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Discharge admission error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
