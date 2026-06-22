"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  BabyIcon,
  CalendarIcon,
  DropletIcon,
  HeartIcon,
  StethoscopeIcon,
  ThermometerIcon,
  UserIcon,
  UserRoundIcon,
  WeightIcon,
  DropletsIcon,
  WindIcon,
  BadgeCheckIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface Assistant {
  id: string
  name: string
  email: string
}

interface PatientData {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string | null
  bloodType: string | null
  birthWeight: number | null
  mother: { name: string; email: string } | null
  admission: {
    admittedAt: string
    notes: string | null
    incubator: {
      code: string
      ward: string
      temperature: number | null
      humidity: number | null
      oxygenLevel: number | null
    } | null
  } | null
}

interface DoctorData {
  id: string
  name: string
  email: string
  specialty: string | null
  licenseNumber: string | null
  assistants: Assistant[]
  patients: PatientData[]
}

export function DoctorDetail({ doctorId }: { doctorId: string }) {
  const router = useRouter()
  const [doctor, setDoctor] = useState<DoctorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`)
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Failed to load doctor.")
          return
        }
        setDoctor(await res.json())
      } catch {
        setError("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [doctorId])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-svh bg-background p-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-40 w-full mb-6" />
        <Skeleton className="h-60 w-full" />
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-svh bg-background p-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6 gap-2">
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Button>
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center text-destructive">
            {error || "Doctor not found."}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-2">
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <StethoscopeIcon className="size-5 text-primary" />
          <h1 className="text-lg font-semibold">{doctor.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6 space-y-8">
        {/* Doctor Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <StethoscopeIcon className="size-6 text-primary" />
                  {doctor.name}
                </CardTitle>
                <CardDescription className="mt-1">{doctor.email}</CardDescription>
              </div>
              {doctor.specialty && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {doctor.specialty}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {doctor.licenseNumber && (
                <div className="flex items-center gap-2">
                  <BadgeCheckIcon className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">License:</span>
                  <span className="font-medium">{doctor.licenseNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <UserRoundIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assistants:</span>
                <span className="font-medium">{doctor.assistants.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <BabyIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Patients:</span>
                <span className="font-medium">{doctor.patients.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assistants */}
        {doctor.assistants.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <UserRoundIcon className="size-5 text-primary" />
              Assistants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.assistants.map((a) => (
                <Card key={a.id} className="hover:bg-muted/30 transition-colors">
                  <CardContent className="flex items-center gap-3 py-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <UserRoundIcon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Patients */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BabyIcon className="size-5 text-primary" />
            Patients ({doctor.patients.length})
          </h2>

          {doctor.patients.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <BabyIcon className="mx-auto size-10 mb-2 opacity-30" />
                <p>No patients assigned yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {doctor.patients.map((patient) => (
                <Card key={patient.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BabyIcon className="size-4 text-primary" />
                          {patient.firstName} {patient.lastName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <CalendarIcon className="size-3.5" />
                          Born {formatDate(patient.birthDate)}
                        </CardDescription>
                      </div>
                      {patient.admission && (
                        <Badge variant="secondary" className="shrink-0">
                          Admitted
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Patient details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {patient.gender && (
                        <div className="flex items-center gap-2 text-sm">
                          <UserIcon className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Gender:</span>
                          <span className="font-medium">{patient.gender}</span>
                        </div>
                      )}
                      {patient.bloodType && (
                        <div className="flex items-center gap-2 text-sm">
                          <DropletIcon className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Blood:</span>
                          <span className="font-medium">{patient.bloodType}</span>
                        </div>
                      )}
                      {patient.birthWeight && (
                        <div className="flex items-center gap-2 text-sm">
                          <WeightIcon className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{patient.birthWeight} kg</span>
                        </div>
                      )}
                      {patient.mother && (
                        <div className="flex items-center gap-2 text-sm">
                          <HeartIcon className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Mother:</span>
                          <span className="font-medium">{patient.mother.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Admission info */}
                    {patient.admission && (
                      <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Admission Details</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground text-xs">Admitted:</span>
                            <p className="font-medium">{formatDate(patient.admission.admittedAt)}</p>
                          </div>
                          {patient.admission.incubator && (
                            <>
                              <div>
                                <span className="text-muted-foreground text-xs">Incubator:</span>
                                <p className="font-medium">{patient.admission.incubator.code}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Ward:</span>
                                <p className="font-medium">{patient.admission.incubator.ward}</p>
                              </div>
                            </>
                          )}
                        </div>
                        {/* Vitals */}
                        {patient.admission.incubator && (
                          <div className="flex gap-4 pt-2 border-t text-sm">
                            {patient.admission.incubator.temperature != null && (
                              <div className="flex items-center gap-1">
                                <ThermometerIcon className="size-3.5 text-orange-500" />
                                <span className="font-medium">{patient.admission.incubator.temperature}°C</span>
                              </div>
                            )}
                            {patient.admission.incubator.humidity != null && (
                              <div className="flex items-center gap-1">
                                <DropletsIcon className="size-3.5 text-blue-500" />
                                <span className="font-medium">{patient.admission.incubator.humidity}%</span>
                              </div>
                            )}
                            {patient.admission.incubator.oxygenLevel != null && (
                              <div className="flex items-center gap-1">
                                <WindIcon className="size-3.5 text-green-500" />
                                <span className="font-medium">{patient.admission.incubator.oxygenLevel}%</span>
                              </div>
                            )}
                          </div>
                        )}
                        {patient.admission.notes && (
                          <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
                            {patient.admission.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
