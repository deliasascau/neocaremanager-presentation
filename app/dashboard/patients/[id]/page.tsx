import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { decryptPatient } from "@/lib/encryption";
import { PatientDetailClient } from "./patient-detail-client";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

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
    return <div className="p-8 text-center text-muted-foreground">Patient not found.</div>;
  }

  const decrypted = decryptPatient(patient);

  const data = {
    id: patient.id,
    firstName: decrypted.firstName,
    lastName: decrypted.lastName,
    birthDate: patient.birthDate.toISOString(),
    gender: patient.gender,
    bloodType: patient.bloodType,
    birthWeight: patient.birthWeight,
    mother: patient.mother
      ? {
          name: patient.mother.user.name,
          email: patient.mother.user.email,
          phone: patient.mother.phone,
          address: patient.mother.address,
        }
      : null,
    doctor: patient.doctor
      ? {
          name: patient.doctor.user.name,
          email: patient.doctor.user.email,
          specialty: patient.doctor.specialty,
        }
      : null,
    admissions: patient.admissions.map((a) => ({
      id: a.id,
      admittedAt: a.admittedAt.toISOString(),
      dischargedAt: a.dischargedAt?.toISOString() ?? null,
      notes: a.notes,
      incubator: a.incubator,
    })),
  };

  return <PatientDetailClient patient={data} />;
}
