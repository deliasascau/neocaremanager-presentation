import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  try {
    // Only ADMIN, DOCTOR, ASSISTANT can create patients
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const body = await request.json();
    const { firstName, lastName, birthDate, gender, bloodType, birthWeight, motherId, doctorId } = body;

    // Validation
    if (!firstName || !lastName || !birthDate || !motherId || !doctorId) {
      return NextResponse.json(
        { error: "firstName, lastName, birthDate, motherId, and doctorId are required." },
        { status: 400 }
      );
    }

    // Verify mother exists
    const mother = await prisma.mother.findUnique({ where: { id: motherId } });
    if (!mother) {
      return NextResponse.json({ error: "Mother not found." }, { status: 404 });
    }

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: encrypt(firstName.trim()),
        lastName: encrypt(lastName.trim()),
        birthDate: new Date(birthDate),
        gender: gender || null,
        bloodType: bloodType || null,
        birthWeight: birthWeight ? parseFloat(birthWeight) : null,
        motherId,
        doctorId,
      },
      include: {
        mother: {
          select: {
            user: { select: { name: true } },
          },
        },
        doctor: {
          select: {
            user: { select: { name: true } },
            specialty: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        firstName,
        lastName,
        birthDate: patient.birthDate,
        gender: patient.gender,
        bloodType: patient.bloodType,
        birthWeight: patient.birthWeight,
        motherName: patient.mother?.user.name,
        doctorName: patient.doctor?.user.name,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create patient error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}