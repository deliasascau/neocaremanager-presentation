"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BabyIcon, CpuIcon, MapPinIcon, CalendarIcon } from "lucide-react"
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

const PAGE_SIZE = 8

interface Admission {
  id: string
  admissionId: string
  newborn: string
  incubatorId: string
  ward: string
  admittedDate: string
}

export function ActiveAdmissions() {
  const router = useRouter()
  const [admissions, setAdmissions] = React.useState<Admission[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(0)

  const totalPages = Math.max(1, Math.ceil(admissions.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = admissions.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  const fetchAdmissions = React.useCallback(async () => {
    try {
      const res = await fetch("/api/stats/active-admissions")
      if (res.ok) {
        const data = await res.json()
        setAdmissions(data)
      }
    } catch (err) {
      console.error("Failed to fetch active admissions:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchAdmissions()
    }, 0)
    window.addEventListener("patient-admitted", fetchAdmissions)
    window.addEventListener("alert-resolved", fetchAdmissions)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("patient-admitted", fetchAdmissions)
      window.removeEventListener("alert-resolved", fetchAdmissions)
    }
  }, [fetchAdmissions])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BabyIcon className="size-5 text-primary" />
            Active Admissions
          </CardTitle>
          <CardDescription>
            Newborns currently in incubators and active care
          </CardDescription>
        </div>
        <Badge variant="outline" className="font-semibold px-2.5 py-0.5">
          {admissions.length} Total Patients
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
              <TableHead className="w-[180px]">Newborn</TableHead>
              <TableHead>Incubator ID</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead className="text-right">Admitted Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No active admissions found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => router.push(`/dashboard/patients/${row.id}`)}
                >
                  <TableCell className="font-medium flex items-center gap-2 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BabyIcon className="size-4" />
                    </div>
                    <span>{row.newborn}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <CpuIcon className="size-3.5" />
                      {row.incubatorId}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPinIcon className="size-3.5 text-muted-foreground" />
                      <span>{row.ward}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 text-muted-foreground font-mono text-xs">
                    <div className="flex items-center justify-end gap-1">
                      <CalendarIcon className="size-3.5" />
                      <span>{row.admittedDate}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}

        {/* Pagination */}
        {admissions.length > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {(page * PAGE_SIZE) + 1}–{Math.min((page + 1) * PAGE_SIZE, admissions.length)} of {admissions.length}
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
