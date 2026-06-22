import { AppSidebar } from "@/components/ui/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ActiveAdmissions } from "@/components/active-admissions"
import { UnsolvedAlerts } from "@/components/unsolved-alerts"
import { PendingUsers } from "@/components/pending-users"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getDashboardStats() {
  try {
    // We're on the server, so we can use the same logic as the API
    const { prisma } = await import("@/lib/prisma")
    const [totalPatients, activeAdmissions, incubators, unsolvedAlerts] = await Promise.all([
      prisma.patient.count(),
      prisma.admission.count({ where: { dischargedAt: null } }),
      prisma.incubator.findMany({ select: { status: true } }),
      prisma.alert.count({ where: { resolved: false } }),
    ])

    return {
      totalPatients,
      activeAdmissions,
      availableIncubators: incubators.filter((i: { status: string }) => i.status === "AVAILABLE").length,
      occupiedIncubators: incubators.filter((i: { status: string }) => i.status === "OCCUPIED").length,
      totalIncubators: incubators.length,
      unsolvedAlerts,
    }
  } catch {
    return null
  }
}

export default async function Page() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  if (session.role === "MOTHER") {
    redirect("/mother")
  }

  if (session.role === "PENDING") {
    redirect("/pending")
  }

  const isAdmin = session?.role === "ADMIN"
  const stats = await getDashboardStats()

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" session={session} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Neonatal Metric Cards */}
                <SectionCards stats={stats} />
                
                {/* Newborn Admissions Area Chart */}
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                
                {/* Active Admissions & Unsolved Alerts side-by-side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-4 lg:px-6">
                  <ActiveAdmissions />
                  <UnsolvedAlerts />
                </div>

                {/* Admin: Pending User Approvals */}
                {isAdmin && (
                  <div className="px-4 lg:px-6">
                    <PendingUsers />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}