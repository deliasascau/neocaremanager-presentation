import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { decryptPatient, encrypt } from "@/lib/encryption";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const { id } = await params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        mother: {
          select: {
            id: true,
            phone: true,
            address: true,
            user: { select: { name: true, email: true } },
          },
        },
        doctor: {
          select: {
            id: true,
            specialty: true,
            user: { select: { name: true, email: true } },
          },
        },
        admissions: {
          include: {
            incubator: {
              select: { code: true, ward: true, temperature: true, humidity: true, oxygenLevel: true },
            },
          },
          orderBy: { admittedAt: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }

    const decrypted = decryptPatient(patient);

    return NextResponse.json({
      id: patient.id,
      firstName: decrypted.firstName,
      lastName: decrypted.lastName,
      birthDate: patient.birthDate,
      gender: patient.gender,
      bloodType: patient.bloodType,
      birthWeight: patient.birthWeight,
      mother: patient.mother
        ? {
            id: patient.mother.id,
            name: patient.mother.user.name,
            email: patient.mother.user.email,
            phone: patient.mother.phone,
            address: patient.mother.address,
          }
        : null,
      doctor: patient.doctor
        ? {
            id: patient.doctor.id,
            name: patient.doctor.user.name,
            email: patient.doctor.user.email,
            specialty: patient.doctor.specialty,
          }
        : null,
      admissions: patient.admissions.map((a) => ({
        id: a.id,
        admittedAt: a.admittedAt,
        dischargedAt: a.dischargedAt,
        notes: a.notes,
        incubator: a.incubator,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Patient detail error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, birthDate, gender, bloodType, birthWeight, doctorId } = body;

    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = encrypt(firstName.trim());
    if (lastName !== undefined) data.lastName = encrypt(lastName.trim());
    if (birthDate !== undefined) data.birthDate = new Date(birthDate);
    if (gender !== undefined) data.gender = gender || null;
    if (bloodType !== undefined) data.bloodType = bloodType || null;
    if (birthWeight !== undefined) data.birthWeight = birthWeight ? parseFloat(birthWeight) : null;
    if (doctorId !== undefined) data.doctorId = doctorId || null;

    const updated = await prisma.patient.update({
      where: { id },
      data,
      include: {
        doctor: { select: { user: { select: { name: true } }, specialty: true } },
      },
    });

    return NextResponse.json({
      success: true,
      patient: {
        id: updated.id,
        firstName: firstName || existing.firstName,
        lastName: lastName || existing.lastName,
        birthDate: updated.birthDate,
        gender: updated.gender,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update patient error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}