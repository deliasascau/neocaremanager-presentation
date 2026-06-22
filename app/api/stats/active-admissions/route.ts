import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { decryptPatient } from "@/lib/encryption";

export async function GET() {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const admissions = await prisma.admission.findMany({
      where: { dischargedAt: null },
      include: {
        patient: {
          select: { firstName: true, lastName: true },
        },
        incubator: {
          select: { code: true, ward: { select: { name: true } } },
        },
      },
      orderBy: { admittedAt: "desc" },
    });

    const result = admissions.map((a) => {
      const decrypted = decryptPatient(a.patient);
      return {
        id: a.patientId,
        admissionId: a.id,
        newborn: `${decrypted.firstName} ${decrypted.lastName}`,
        incubatorId: a.incubator.code,
        ward: a.incubator.ward.name,
        admittedDate: a.admittedAt.toISOString().split("T")[0],
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Active admissions error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
