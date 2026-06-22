import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const body = await request.json();
    const { patientId, incubatorId, notes } = body;

    if (!patientId || !incubatorId) {
      return NextResponse.json(
        { error: "patientId and incubatorId are required." },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }

    // Check patient is not already admitted
    const activeAdmission = await prisma.admission.findFirst({
      where: { patientId, dischargedAt: null },
    });
    if (activeAdmission) {
      return NextResponse.json(
        { error: "Patient is already admitted to an incubator." },
        { status: 409 }
      );
    }

    // Verify incubator exists and is available
    const incubator = await prisma.incubator.findUnique({ where: { id: incubatorId } });
    if (!incubator) {
      return NextResponse.json({ error: "Incubator not found." }, { status: 404 });
    }
    if (incubator.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: `Incubator is ${incubator.status.toLowerCase()}, not available.` },
        { status: 409 }
      );
    }

    const activeIncubatorAdmission = await prisma.admission.findFirst({
      where: { incubatorId, dischargedAt: null },
    });
    if (activeIncubatorAdmission) {
      return NextResponse.json(
        { error: "Incubator already has an active admission." },
        { status: 409 }
      );
    }

    // Create admission + mark incubator as OCCUPIED in a transaction
    const admission = await prisma.$transaction(async (tx) => {
      const adm = await tx.admission.create({
        data: {
          patientId,
          incubatorId,
          notes: notes || null,
        },
      });

      await tx.incubator.update({
        where: { id: incubatorId },
        data: { status: "OCCUPIED" },
      });

      return adm;
    });

    return NextResponse.json({
      success: true,
      admission: {
        id: admission.id,
        patientId: admission.patientId,
        incubatorId: admission.incubatorId,
        admittedAt: admission.admittedAt,
        notes: admission.notes,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Active admission already exists for this patient or incubator." },
        { status: 409 }
      );
    }
    console.error("Admit patient error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
