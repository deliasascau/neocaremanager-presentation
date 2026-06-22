"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon, ActivityIcon, ClockIcon, ThermometerIcon, ZapIcon, HeartIcon, CheckCircleIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const PAGE_SIZE = 8

interface Alert {
  id: string
  message: string
  type: string
  priority: string
  incubatorCode: string
  time: string
}

export function UnsolvedAlerts() {
  const router = useRouter()
  const [alerts, setAlerts] = React.useState<Alert[]>([])
  const [loading, setLoading] = React.useState(true)
  const [resolving, setResolving] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(0)

  const totalPages = Math.max(1, Math.ceil(alerts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = alerts.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  const fetchAlerts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/alerts")
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchAlerts()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [fetchAlerts])

  async function handleResolve(alertId: string) {
    setResolving(alertId)
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved: true }),
      })
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId))
        window.dispatchEvent(new Event("alert-resolved"))
        toast.success("Alert resolved.")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to resolve alert.")
      }
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setResolving(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "oxygen":
        return <ActivityIcon className="size-3.5 text-sky-500" />
      case "temperature":
        return <ThermometerIcon className="size-3.5 text-amber-500" />
      case "respiration":
        return <ActivityIcon className="size-3.5 text-emerald-500" />
      case "system":
        return <ZapIcon className="size-3.5 text-purple-500" />
      case "cardiac":
        return <HeartIcon className="size-3.5 text-rose-500" />
      default:
        return <AlertTriangleIcon className="size-3.5 text-amber-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return (
          <Badge variant="destructive" className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 animate-pulse">
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5">
            Medium
          </Badge>
        )
      default:
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5">
            Low
          </Badge>
        )
    }
  }

  function formatTime(isoString: string) {
    const d = new Date(isoString)
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangleIcon className="size-5 text-destructive" />
            Unsolved Alerts
          </CardTitle>
          <CardDescription>
            Active critical alerts and system warnings needing attention
          </CardDescription>
        </div>
        <Badge variant="destructive" className="font-semibold px-2.5 py-0.5 animate-pulse">
          {alerts.length} Pending Alerts
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  All alerts resolved. Excellent work!
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  <TableCell
                    className="font-medium py-3 text-sm text-foreground max-w-[280px] truncate cursor-pointer hover:text-primary"
                    onClick={() => router.push(`/dashboard/alerts/${row.id}`)}
                  >
                    {row.message}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      {getTypeIcon(row.type)}
                      <span>{row.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {getPriorityBadge(row.priority)}
                  </TableCell>
                  <TableCell className="text-right py-3 text-muted-foreground font-mono text-xs">
                    <div className="flex items-center justify-end gap-1">
                      <ClockIcon className="size-3.5" />
                      <span>{formatTime(row.time)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolve(row.id)}
                      disabled={resolving === row.id}
                      className="gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircleIcon className="size-4" />
                      {resolving === row.id ? "..." : "Resolve"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}

        {/* Pagination */}
        {alerts.length > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {(page * PAGE_SIZE) + 1}–{Math.min((page + 1) * PAGE_SIZE, alerts.length)} of {alerts.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
