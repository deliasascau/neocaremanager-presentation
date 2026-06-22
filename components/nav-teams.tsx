"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRightIcon, StethoscopeIcon, UserRoundIcon } from "lucide-react"
import { Collapsible } from "radix-ui"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

interface Assistant {
  id: string
  name: string
  email: string
}

interface Doctor {
  id: string
  name: string
  email: string
  specialty: string | null
  assistants: Assistant[]
}

export function NavTeams() {
  const [teams, setTeams] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/staff/teams")
        if (res.ok) {
          setTeams(await res.json())
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Teams</SidebarGroupLabel>
        <SidebarMenu>
          {[1, 2].map((i) => (
            <SidebarMenuItem key={i}>
              <Skeleton className="h-8 w-full" />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  if (teams.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarMenu>
        {teams.map((doctor) => (
          <Collapsible.Root
            key={doctor.id}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <Collapsible.Trigger asChild>
                <SidebarMenuButton
                  tooltip={doctor.name}
                  onClick={() => router.push(`/dashboard/doctors/${doctor.id}`)}
                >
                  <StethoscopeIcon className="size-4" />
                  <span className="truncate">{doctor.name}</span>
                  {doctor.specialty && (
                    <span className="ml-auto text-xs text-muted-foreground truncate max-w-20">
                      {doctor.specialty}
                    </span>
                  )}
                  <ChevronRightIcon className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <SidebarMenuSub>
                  {doctor.assistants.length === 0 ? (
                    <SidebarMenuSubItem>
                      <span className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                        No assistants assigned
                      </span>
                    </SidebarMenuSubItem>
                  ) : (
                    doctor.assistants.map((assistant) => (
                      <SidebarMenuSubItem key={assistant.id}>
                        <SidebarMenuSubButton asChild>
                          <a href="#">
                            <UserRoundIcon className="size-3.5" />
                            <span className="truncate">{assistant.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  )}
                </SidebarMenuSub>
              </Collapsible.Content>
            </SidebarMenuItem>
          </Collapsible.Root>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}