import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { decryptPatient } from "@/lib/encryption";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const { id } = await params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        assistants: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        patients: {
          include: {
            admissions: {
              where: { dischargedAt: null },
              include: {
                incubator: {
                  select: {
                    code: true,
                    ward: true,
                    temperature: true,
                    humidity: true,
                    oxygenLevel: true,
                  },
                },
              },
              orderBy: { admittedAt: "desc" },
              take: 1,
            },
            mother: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
          orderBy: { birthDate: "desc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    const result = {
      id: doctor.id,
      name: doctor.user.name,
      email: doctor.user.email,
      specialty: doctor.specialty,
      licenseNumber: doctor.licenseNumber,
      assistants: doctor.assistants.map((a: { id: string; user: { name: string; email: string } }) => ({
        id: a.id,
        name: a.user.name,
        email: a.user.email,
      })),
      patients: doctor.patients.map((p: {
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
        gender: string | null;
        bloodType: string | null;
        birthWeight: number | null;
        mother: { user: { name: string; email: string } } | null;
        admissions: {
          admittedAt: Date;
          dischargedAt: Date | null;
          notes: string | null;
          incubator: {
            code: string;
            ward: string;
            temperature: number | null;
            humidity: number | null;
            oxygenLevel: number | null;
          } | null;
        }[];
      }) => {
        const decrypted = decryptPatient(p);
        return {
          id: p.id,
          firstName: decrypted.firstName,
          lastName: decrypted.lastName,
          birthDate: p.birthDate,
          gender: p.gender,
          bloodType: p.bloodType,
          birthWeight: p.birthWeight,
          mother: p.mother
            ? {
                name: p.mother.user.name,
                email: p.mother.user.email,
              }
            : null,
          admission: p.admissions[0]
            ? {
                admittedAt: p.admissions[0].admittedAt,
                notes: p.admissions[0].notes,
                incubator: p.admissions[0].incubator,
              }
            : null,
        };
      }),
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Doctor detail error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}