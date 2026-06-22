"use client"

import Link from "next/link"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ClockIcon,
  ActivityIcon,
  ThermometerIcon,
  WindIcon,
  HeartIcon,
  ZapIcon,
  MapPinIcon,
  CheckCircleIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AlertData {
  id: string
  message: string
  type: string
  priority: string
  resolved: boolean
  createdAt: string
  incubator: {
    code: string
    ward: string
    status: string
    temperature: number | null
    humidity: number | null
    oxygenLevel: number | null
  }
}

const typeIcons: Record<string, React.ElementType> = {
  Oxygen: ActivityIcon,
  Temperature: ThermometerIcon,
  Respiration: ActivityIcon,
  System: ZapIcon,
  Cardiac: HeartIcon,
}

const typeColors: Record<string, string> = {
  Oxygen: "text-sky-500 bg-sky-500/10",
  Temperature: "text-amber-500 bg-amber-500/10",
  Respiration: "text-emerald-500 bg-emerald-500/10",
  System: "text-purple-500 bg-purple-500/10",
  Cardiac: "text-rose-500 bg-rose-500/10",
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "critical": return "bg-red-500/10 text-red-600 border-red-500/20"
    case "high": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    default: return "bg-blue-500/10 text-blue-600 border-blue-500/20"
  }
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

export function AlertDetailClient({ alert }: { alert: AlertData }) {
  const TypeIcon = typeIcons[alert.type] || AlertTriangleIcon
  const typeColor = typeColors[alert.type] || "text-amber-500 bg-amber-500/10"

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard" className="gap-2">
            <ArrowLeftIcon className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangleIcon className="size-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alert Detail</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={`px-3 py-1 ${getPriorityColor(alert.priority)}`}>
            <ShieldAlertIcon className="size-3 mr-1" />
            {alert.priority}
          </Badge>
          {alert.resolved ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1">
              <CheckCircleIcon className="size-3 mr-1" />
              Resolved
            </Badge>
          ) : (
            <Badge variant="destructive" className="px-3 py-1 animate-pulse">Active</Badge>
          )}
        </div>
      </div>

      {/* Alert Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangleIcon className="size-4 text-destructive" />
            Alert Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-4">
            <div className={`flex size-10 items-center justify-center rounded-xl ${typeColor}`}>
              <TypeIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-muted-foreground">Type: {alert.type}</p>
            </div>
          </div>
          <InfoRow icon={ClockIcon} label="Created At" value={new Date(alert.createdAt).toLocaleString()} />
        </CardContent>
      </Card>

      {/* Incubator info */}
      {alert.incubator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ThermometerIcon className="size-4 text-primary" />
              Incubator — {alert.incubator.code}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={MapPinIcon} label="Ward" value={alert.incubator.ward} />
            <InfoRow icon={ActivityIcon} label="Status" value={alert.incubator.status} />
            <InfoRow icon={ThermometerIcon} label="Temperature" value={alert.incubator.temperature ? `${alert.incubator.temperature} °C` : null} />
            <InfoRow icon={WindIcon} label="Humidity" value={alert.incubator.humidity ? `${alert.incubator.humidity} %` : null} />
            <InfoRow icon={ActivityIcon} label="Oxygen Level" value={alert.incubator.oxygenLevel ? `${alert.incubator.oxygenLevel} %` : null} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}