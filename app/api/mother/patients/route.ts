import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { decryptPatient } from "@/lib/encryption";

export async function GET() {
  try {
    const user = await getSession();

    if (!user || user.role !== "MOTHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find the Mother record linked to this user
    let mother = await prisma.mother.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    // Auto-create Mother record if it doesn't exist (e.g., role was assigned before the fix)
    if (!mother) {
      mother = await prisma.mother.create({
        data: { userId: user.id },
        select: { id: true },
      });
    }

    // Get all patients for this mother, with active admissions
    const patients = await prisma.patient.findMany({
      where: { motherId: mother.id },
      include: {
        admissions: {
          where: { dischargedAt: null },
          include: {
            incubator: {
              select: {
                code: true,
                ward: { select: { name: true } },
                temperature: true,
                humidity: true,
                oxygenLevel: true,
                alerts: {
                  where: { resolved: false },
                  select: { id: true, message: true, type: true, priority: true },
                  orderBy: { createdAt: "desc" },
                },
              },
            },
          },
          orderBy: { admittedAt: "desc" },
          take: 1,
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: { name: true },
            },
            specialty: true,
            assistants: {
              select: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
      orderBy: { birthDate: "desc" },
    });

    const result = patients.map((p) => {
      let firstName = p.firstName;
      let lastName = p.lastName;
      try {
        const decrypted = decryptPatient(p);
        firstName = decrypted.firstName;
        lastName = decrypted.lastName;
      } catch {
        // keep raw values
      }
      return {
        id: p.id,
        firstName,
        lastName,
        birthDate: p.birthDate,
        gender: p.gender,
        bloodType: p.bloodType,
        birthWeight: p.birthWeight,
        doctor: p.doctor
          ? {
              id: p.doctor.id,
              name: p.doctor.user.name,
              specialty: p.doctor.specialty,
              assistants: p.doctor.assistants.map((a: { user: { name: string; email: string } }) => ({
                name: a.user.name,
                email: a.user.email,
              })),
            }
          : null,
        admission: p.admissions[0]
          ? {
              admittedAt: p.admissions[0].admittedAt,
              notes: p.admissions[0].notes,
              incubator: {
                code: p.admissions[0].incubator.code,
                ward: p.admissions[0].incubator.ward.name,
                temperature: p.admissions[0].incubator.temperature,
                humidity: p.admissions[0].incubator.humidity,
                oxygenLevel: p.admissions[0].incubator.oxygenLevel,
                alerts: p.admissions[0].incubator.alerts,
              },
            }
          : null,
      };
    });

    return NextResponse.json({ patients: result });
  } catch (error) {
    console.error("[mother/patients] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
