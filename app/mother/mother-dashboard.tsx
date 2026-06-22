"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BabyIcon,
  CalendarIcon,
  DropletIcon,
  HeartIcon,
  LogOutIcon,
  ThermometerIcon,
  UserIcon,
  UserRoundIcon,
  WeightIcon,
  DropletsIcon,
  WindIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientData {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string | null
  bloodType: string | null
  birthWeight: number | null
  doctor: {
    id: string
    name: string
    specialty: string | null
    assistants: { name: string; email: string }[]
  } | null
  admission: {
    admittedAt: string
    notes: string | null
    incubator: {
      code: string
      ward: string | null
      temperature: number | null
      humidity: number | null
      oxygenLevel: number | null
    } | null
  } | null
}

export function MotherDashboard() {
  const router = useRouter()
  const [patients, setPatients] = useState<PatientData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, patientsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/mother/patients"),
        ])

        if (meRes.ok) {
          const meData = await meRes.json()
          if (meData.name) setUserName(meData.name)
        }

        if (!patientsRes.ok) {
          const text = await patientsRes.text()
          console.error("[mother] patients API error:", patientsRes.status, text.slice(0, 200))
          setError("Failed to load patients. Server returned " + patientsRes.status)
          return
        }

        const patientsData = await patientsRes.json()
        setPatients(patientsData.patients || [])
      } catch (err) {
        setError("Something went wrong. Please try again.")
        console.error("Mother dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.refresh()
    router.replace("/auth/login")
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <BabyIcon className="size-5 text-primary" />
            <h1 className="text-lg font-semibold">NeoCare</h1>
          </div>
          <div className="flex items-center gap-3">
            {userName && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Bun venit, {userName}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOutIcon className="size-4" />
              <span className="hidden sm:inline">Deconectare</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Copiii mei</h2>
          <p className="text-muted-foreground mt-1">
            Informații despre nou-născuții dumneavoastră internați în secția de neonatologie.
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {!loading && !error && patients.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <BabyIcon className="mx-auto size-12 mb-3 opacity-30" />
              <p>Nu există pacienți asociați contului dumneavoastră.</p>
              <p className="text-sm mt-1">
                Dacă acest lucru este o eroare, vă rugăm să contactați personalul medical.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && patients.length > 0 && (
          <div className="space-y-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BabyIcon className="size-5 text-primary" />
                        {patient.firstName} {patient.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <CalendarIcon className="size-3.5" />
                        Născut(ă) pe {formatDate(patient.birthDate)}
                      </CardDescription>
                    </div>
                    {patient.admission && (
                      <Badge variant="secondary" className="shrink-0">
                        Internat(ă)
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Patient details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {patient.gender && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Sex:</span>
                        <span className="font-medium">
                          {patient.gender === "Male" ? "Masculin" : patient.gender === "Female" ? "Feminin" : patient.gender}
                        </span>
                      </div>
                    )}
                    {patient.bloodType && (
                      <div className="flex items-center gap-2 text-sm">
                        <DropletIcon className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Grupa:</span>
                        <span className="font-medium">{patient.bloodType}</span>
                      </div>
                    )}
                    {patient.birthWeight && (
                      <div className="flex items-center gap-2 text-sm">
                        <WeightIcon className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Greutate:</span>
                        <span className="font-medium">{patient.birthWeight} kg</span>
                      </div>
                    )}
                    {patient.doctor && (
                      <div className="flex items-center gap-2 text-sm">
                        <HeartIcon className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Doctor:</span>
                        <span className="font-medium">{patient.doctor.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Doctor's assistants */}
                  {patient.doctor && patient.doctor.assistants.length > 0 && (
                    <div className="rounded-lg border bg-muted/30 p-3 mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Asistenți medicali</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.doctor.assistants.map((a, i) => (
                          <Badge key={i} variant="outline" className="gap-1.5">
                            <UserRoundIcon className="size-3" />
                            {a.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admission / Incubator info */}
                  {patient.admission && (
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <p className="text-sm font-medium">Detalii internare</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Data internării:</span>
                          <p className="font-medium">{formatDate(patient.admission.admittedAt)}</p>
                        </div>
                        {patient.admission.incubator && (
                          <>
                            <div>
                              <span className="text-muted-foreground">Incubator:</span>
                              <p className="font-medium">{patient.admission.incubator.code}</p>
                            </div>
                            {patient.admission.incubator.ward && (
                              <div>
                                <span className="text-muted-foreground">Salon:</span>
                                <p className="font-medium">{patient.admission.incubator.ward}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {/* Incubator vitals */}
                      {patient.admission.incubator && (
                        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                          {patient.admission.incubator.temperature != null && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <ThermometerIcon className="size-4 text-orange-500" />
                              <div>
                                <span className="text-muted-foreground text-xs">Temp</span>
                                <p className="font-medium">{patient.admission.incubator.temperature}°C</p>
                              </div>
                            </div>
                          )}
                          {patient.admission.incubator.humidity != null && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <DropletsIcon className="size-4 text-blue-500" />
                              <div>
                                <span className="text-muted-foreground text-xs">Umiditate</span>
                                <p className="font-medium">{patient.admission.incubator.humidity}%</p>
                              </div>
                            </div>
                          )}
                          {patient.admission.incubator.oxygenLevel != null && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <WindIcon className="size-4 text-green-500" />
                              <div>
                                <span className="text-muted-foreground text-xs">O2</span>
                                <p className="font-medium">{patient.admission.incubator.oxygenLevel}%</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {patient.admission.notes && (
                        <p className="text-sm text-muted-foreground border-t pt-2 mt-2">
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
      </main>
    </div>
  )
}
