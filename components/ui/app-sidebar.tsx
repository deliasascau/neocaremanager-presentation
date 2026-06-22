"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavTeams } from "@/components/nav-teams"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, CommandIcon } from "lucide-react"

interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  ASSISTANT: "Assistant",
  MOTHER: "Mother",
  PENDING: "Pending",
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
  ],
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AppSidebar({ session, ...props }: React.ComponentProps<typeof Sidebar> & { session?: SessionUser | null }) {
  const userName = session?.name || "NeoCare Manager"
  const userEmail = session?.email || "contact@neocare.com"
  const userRole = session?.role ? ROLE_LABELS[session.role] || session.role : "Staff"
  const initials = getInitials(userName)

  const user = {
    name: userName,
    email: userEmail,
    role: userRole,
    avatar: "",
    initials,
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">NeoCare Manager</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTeams />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
