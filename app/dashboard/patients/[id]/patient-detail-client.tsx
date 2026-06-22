"use client"

import Link from "next/link"
import {
  BabyIcon,
  ArrowLeftIcon,
  CalendarIcon,
  WeightIcon,
  DropletsIcon,
  ThermometerIcon,
  WindIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ActivityIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PatientData {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string | null
  bloodType: string | null
  birthWeight: number | null
  mother: {
    name: string
    email: string
    phone: string | null
    address: string | null
  } | null
  doctor: {
    name: string
    email: string
    specialty: string | null
  } | null
  admissions: {
    id: string
    admittedAt: string
    dischargedAt: string | null
    notes: string | null
    incubator: {
      code: string
      ward: string
      temperature: number | null
      humidity: number | null
      oxygenLevel: number | null
    } | null
  }[]
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  )
}

export function PatientDetailClient({ patient }: { patient: PatientData }) {
  const activeAdmission = patient.admissions.find((a) => !a.dischargedAt)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard" className="gap-2">
            <ArrowLeftIcon className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <BabyIcon className="size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {patient.gender || "Unknown"} · Born {new Date(patient.birthDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {activeAdmission ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1">
              <ActivityIcon className="size-3.5 mr-1" />
              Admitted
            </Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1">Not admitted</Badge>
          )}
          {patient.bloodType && (
            <Badge variant="outline" className="px-3 py-1 font-mono">{patient.bloodType}</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Medical info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulseIcon className="size-4 text-primary" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={CalendarIcon} label="Birth Date" value={new Date(patient.birthDate).toLocaleDateString()} />
            <InfoRow icon={BabyIcon} label="Gender" value={patient.gender} />
            <InfoRow icon={DropletsIcon} label="Blood Type" value={patient.bloodType} />
            <InfoRow icon={WeightIcon} label="Birth Weight" value={patient.birthWeight ? `${patient.birthWeight} kg` : null} />
          </CardContent>
        </Card>

        {/* Assigned doctor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <StethoscopeIcon className="size-4 text-primary" />
              Assigned Doctor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.doctor ? (
              <>
                <InfoRow icon={UserIcon} label="Name" value={patient.doctor.name} />
                <InfoRow icon={MailIcon} label="Email" value={patient.doctor.email} />
                <InfoRow icon={StethoscopeIcon} label="Specialty" value={patient.doctor.specialty} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No doctor assigned.</p>
            )}
          </CardContent>
        </Card>

        {/* Mother info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserIcon className="size-4 text-primary" />
              Mother Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.mother ? (
              <>
                <InfoRow icon={UserIcon} label="Name" value={patient.mother.name} />
                <InfoRow icon={MailIcon} label="Email" value={patient.mother.email} />
                <InfoRow icon={PhoneIcon} label="Phone" value={patient.mother.phone} />
                <InfoRow icon={MapPinIcon} label="Address" value={patient.mother.address} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No mother information.</p>
            )}
          </CardContent>
        </Card>

        {/* Active admission / incubator */}
        {activeAdmission && activeAdmission.incubator && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ThermometerIcon className="size-4 text-primary" />
                Incubator — {activeAdmission.incubator.code}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={MapPinIcon} label="Ward" value={activeAdmission.incubator.ward} />
              <InfoRow icon={CalendarIcon} label="Admitted At" value={new Date(activeAdmission.admittedAt).toLocaleString()} />
              <InfoRow icon={ThermometerIcon} label="Temperature" value={activeAdmission.incubator.temperature ? `${activeAdmission.incubator.temperature} °C` : null} />
              <InfoRow icon={WindIcon} label="Humidity" value={activeAdmission.incubator.humidity ? `${activeAdmission.incubator.humidity} %` : null} />
              <InfoRow icon={ActivityIcon} label="Oxygen Level" value={activeAdmission.incubator.oxygenLevel ? `${activeAdmission.incubator.oxygenLevel} %` : null} />
              {activeAdmission.notes && (
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm">{activeAdmission.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Admission history */}
      {patient.admissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ActivityIcon className="size-4 text-primary" />
              Admission History ({patient.admissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patient.admissions.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {a.incubator?.code || "Unknown incubator"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.incubator?.ward} · {new Date(a.admittedAt).toLocaleDateString()}
                      {a.dischargedAt ? ` → ${new Date(a.dischargedAt).toLocaleDateString()}` : " → Active"}
                    </p>
                  </div>
                  {!a.dischargedAt && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      Active
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}