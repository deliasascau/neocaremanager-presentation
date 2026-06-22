"use client"

import { useState, useEffect, useCallback } from "react"
import { BabyIcon, Loader2Icon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Mother {
  id: string
  name: string
  email: string
}

interface Doctor {
  id: string
  name: string
  email: string
  specialty: string | null
}

interface Incubator {
  id: string
  code: string
  ward: string
  status: string
}

const ALERT_PRESETS = [
  { value: "healthy", label: "✅ Healthy — No alert", type: "", priority: "" },
  { value: "premature", label: "⚠️ Premature — Requires monitoring", type: "Respiration", priority: "High" },
  { value: "low_weight", label: "⚖️ Low Birth Weight — Nutritional support", type: "System", priority: "Medium" },
  { value: "respiratory", label: "🫁 Respiratory Distress — Oxygen monitoring", type: "Oxygen", priority: "Critical" },
  { value: "jaundice", label: "💛 Jaundice — Phototherapy", type: "System", priority: "Medium" },
  { value: "temperature", label: "🌡️ Temperature Instability", type: "Temperature", priority: "High" },
  { value: "cardiac", label: "❤️ Cardiac Concern — Heart monitoring", type: "Cardiac", priority: "Critical" },
]

export function AddPatientDrawer() {
  const [open, setOpen] = useState(false)
  const [mothers, setMothers] = useState<Mother[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [incubators, setIncubators] = useState<Incubator[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [gender, setGender] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [birthWeight, setBirthWeight] = useState("")
  const [motherId, setMotherId] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const [incubatorId, setIncubatorId] = useState("")
  const [alertPreset, setAlertPreset] = useState("healthy")

  const loadOptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [mothersRes, doctorsRes, incubatorsRes] = await Promise.all([
        fetch("/api/mothers"),
        fetch("/api/doctors"),
        fetch("/api/incubators"),
      ])

      if (mothersRes.ok) setMothers(await mothersRes.json())
      if (doctorsRes.ok) setDoctors(await doctorsRes.json())
      if (incubatorsRes.ok) setIncubators(await incubatorsRes.json())
    } catch {
      setError("Could not load form options.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => {
      void loadOptions()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadOptions, open])

  function resetForm() {
    setFirstName("")
    setLastName("")
    setBirthDate("")
    setGender("")
    setBloodType("")
    setBirthWeight("")
    setMotherId("")
    setDoctorId("")
    setIncubatorId("")
    setAlertPreset("healthy")
    setError(null)
    setSuccess(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!firstName || !lastName || !birthDate || !motherId || !doctorId) {
      setError("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    try {
      // 1. Create the patient
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDate,
          gender: gender || null,
          bloodType: bloodType || null,
          birthWeight: birthWeight || null,
          motherId,
          doctorId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create patient.")
        return
      }

      const patientId = data.patient?.id

      // 2. If an incubator is selected, admit the patient
      let admitted = false
      if (incubatorId && patientId) {
        const admitRes = await fetch("/api/admissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            incubatorId,
            notes: `Admitted via registration`,
          }),
        })

        if (!admitRes.ok) {
          const admitData = await admitRes.json()
          setError(`Patient created, but admission failed: ${admitData.error || "Unknown error."}`)
          window.dispatchEvent(new Event("patient-admitted"))
          return
        }

        admitted = true
      }

      // 3. If an alert preset is selected (not "healthy") and an incubator is chosen, create the alert
      const preset = ALERT_PRESETS.find((p) => p.value === alertPreset)
      if (preset && preset.value !== "healthy" && incubatorId && admitted) {
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            incubatorId,
            message: `${preset.label.replace(/^[^\s]+\s/, "")} — ${firstName} ${lastName}`,
            type: preset.type,
            priority: preset.priority,
          }),
        })
      }

      setSuccess(`Patient ${data.patient.firstName} ${data.patient.lastName} created successfully!`)
      resetForm()

      // Notify ActiveAdmissions to refresh
      window.dispatchEvent(new Event("patient-admitted"))

      setTimeout(() => {
        setOpen(false)
        setSuccess(null)
      }, 1500)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (v) setOpen(true) }}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          Add Patient
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <BabyIcon className="size-5 text-primary" />
            Add New Patient
          </SheetTitle>
          <SheetDescription>
            Register a newborn patient. Fields marked with * are required.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-4">
          {/* Row: First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sophia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Lucas"
                required
              />
            </div>
          </div>

          {/* Row: Birth Date + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row: Blood Type + Birth Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select value={bloodType} onValueChange={setBloodType}>
                <SelectTrigger id="bloodType" className="w-full">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
              <Input
                id="birthWeight"
                type="number"
                step="0.01"
                min="0.5"
                max="6"
                value={birthWeight}
                onChange={(e) => setBirthWeight(e.target.value)}
                placeholder="e.g. 3.2"
              />
            </div>
          </div>

          {/* Row: Mother + Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mother">Mother *</Label>
              <Select value={motherId} onValueChange={setMotherId} disabled={loading}>
                <SelectTrigger id="mother" className="w-full">
                  <SelectValue placeholder={loading ? "Loading..." : "Select mother"} />
                </SelectTrigger>
                <SelectContent>
                  {mothers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor *</Label>
              <Select value={doctorId} onValueChange={setDoctorId} disabled={loading}>
                <SelectTrigger id="doctor" className="w-full">
                  <SelectValue placeholder={loading ? "Loading..." : "Select doctor"} />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}{d.specialty ? ` (${d.specialty})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row: Incubator + Alert Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incubator">Assign Incubator</Label>
              <Select value={incubatorId} onValueChange={setIncubatorId} disabled={loading}>
                <SelectTrigger id="incubator" className="w-full">
                  <SelectValue placeholder={loading ? "Loading..." : "Select incubator"} />
                </SelectTrigger>
                <SelectContent>
                  {incubators.map((inc) => (
                    <SelectItem key={inc.id} value={inc.id} disabled={inc.status !== "AVAILABLE"}>
                      {inc.code} — {inc.ward} ({inc.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertPreset">Alert Status</Label>
              <Select value={alertPreset} onValueChange={setAlertPreset}>
                <SelectTrigger id="alertPreset" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ALERT_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          )}

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { setOpen(false); resetForm() }}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || loading} className="gap-2">
              {submitting && <Loader2Icon className="size-4 animate-spin" />}
              {submitting ? "Creating..." : "Create Patient"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
