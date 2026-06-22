"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"

export const description = "An interactive area chart for newborns admissions"

interface ChartDataPoint {
  date: string
  admissions: number
}

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0]
}

function toWeekKey(value: string) {
  const date = new Date(value)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return toDateKey(date)
}

const chartConfig = {
  admissions: {
    label: "Internări",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/stats/admissions")
        if (res.ok) {
          const data = await res.json()
          setChartData(Array.isArray(data.chartData) ? data.chartData : [])
        }
      } catch (err) {
        console.error("Failed to fetch admissions stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    startDate.setHours(0, 0, 0, 0)

    return chartData.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [chartData, timeRange])

  const totalRangeAdmissions = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.admissions, 0)
  }, [filteredData])

  const displayData = React.useMemo(() => {
    if (timeRange !== "90d") return filteredData

    const byWeek = new Map<string, ChartDataPoint>()
    for (const item of filteredData) {
      const week = toWeekKey(item.date)
      const existing = byWeek.get(week) ?? { date: week, admissions: 0 }
      existing.admissions += item.admissions
    return Array.from(byWeek.values())
  }, [filteredData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>New Newborn Admissions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total of {totalRangeAdmissions.toFixed(0)} admissions in selected timeframe
          </span>
          <span className="@[540px]/card:hidden">Admissions: {totalRangeAdmissions.toFixed(0)}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="fillAdmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-admissions)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-admissions)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={28}
              domain={[0, (dataMax: number) => Math.max(3, dataMax)]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="admissions"
              type="monotone"
              fill="url(#fillAdmissions)"
              stroke="var(--color-admissions)"
            />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
