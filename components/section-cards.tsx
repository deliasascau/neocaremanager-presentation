"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  BabyIcon, 
  ActivityIcon, 
  CpuIcon, 
  AlertTriangleIcon 
} from "lucide-react"

interface DashboardStats {
  totalPatients: number
  activeAdmissions: number
  availableIncubators: number
  occupiedIncubators: number
  totalIncubators: number
  unsolvedAlerts: number
}

interface SectionCardsProps {
  stats: DashboardStats | null
  loading?: boolean
}

export function SectionCards({ stats, loading }: SectionCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pb-4">
              <Skeleton className="h-8 w-16" />
            </CardContent>
            <CardFooter className="border-t bg-muted/20">
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const occupancyPct = stats.totalIncubators > 0
    ? Math.round((stats.occupiedIncubators / stats.totalIncubators) * 100)
    : 0
  const freePct = 100 - occupancyPct

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-5 dark:*:data-[slot=card]:bg-card">
      
      {/* Card 1: Total Newborns */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Total Newborns</CardDescription>
          <CardAction>
            <BabyIcon className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between pb-4">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalPatients}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold">
            <TrendingUpIcon className="mr-1 size-3" />
            RECORD
          </Badge>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm border-t bg-muted/20">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cumulative record <TrendingUpIcon className="size-3.5" />
          </div>
          <div className="text-muted-foreground text-xs">
            All registered newborns
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Active Admissions */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Active Admissions</CardDescription>
          <CardAction>
            <ActivityIcon className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between pb-4">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeAdmissions}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold bg-primary/5 border-primary/20 text-primary">
            ACTIVE
          </Badge>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm border-t bg-muted/20">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Currently in care <ActivityIcon className="size-3.5" />
          </div>
          <div className="text-muted-foreground text-xs">
            Continuous monitoring active
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Available Incubators */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Available Incubators</CardDescription>
          <CardAction>
            <CpuIcon className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between pb-4">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.availableIncubators}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold">
            <TrendingDownIcon className="mr-1 size-3" />
            {freePct}% FREE
          </Badge>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm border-t bg-muted/20">
          <div className={`line-clamp-1 flex gap-2 font-medium ${stats.availableIncubators <= 2 ? "text-amber-600 dark:text-amber-500" : ""}`}>
            {stats.availableIncubators <= 2 ? "Low inventory" : "Ready for use"} <TrendingDownIcon className="size-3.5" />
          </div>
          <div className="text-muted-foreground text-xs">
            Cleaned & calibrated for use
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Occupied Incubators */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Occupied Incubators</CardDescription>
          <CardAction>
            <CpuIcon className="size-4 text-primary" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between pb-4">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.occupiedIncubators}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold">
            <TrendingUpIcon className="mr-1 size-3" />
            {occupancyPct}% CAP
          </Badge>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm border-t bg-muted/20">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Telemetry streaming <TrendingUpIcon className="size-3.5" />
          </div>
          <div className="text-muted-foreground text-xs">
            High-fidelity vitals active
          </div>
        </CardFooter>
      </Card>

      {/* Card 5: Unsolved Alerts */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Unsolved Alerts</CardDescription>
          <CardAction>
            <AlertTriangleIcon className="size-4 text-destructive" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between pb-4">
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.unsolvedAlerts > 0 ? "text-destructive" : ""}`}>
            {stats.unsolvedAlerts}
          </CardTitle>
          <Badge variant={stats.unsolvedAlerts > 0 ? "destructive" : "outline"} className="text-[10px] font-bold uppercase tracking-wider">
            {stats.unsolvedAlerts > 0 ? "ACTION" : "CLEAR"}
          </Badge>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm border-t bg-muted/20">
          <div className={`line-clamp-1 flex gap-2 font-medium ${stats.unsolvedAlerts > 0 ? "text-destructive" : ""}`}>
            {stats.unsolvedAlerts > 0 ? "Critical alarms" : "All clear"} <AlertTriangleIcon className="size-3.5" />
          </div>
          <div className="text-muted-foreground text-xs">
            {stats.unsolvedAlerts > 0 ? "Requires immediate attention" : "No pending alerts"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}