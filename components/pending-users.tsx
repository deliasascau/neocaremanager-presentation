"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { UserCheckIcon, ClockIcon, MailIcon, ShieldCheckIcon } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface PendingUser {
  id: string
  name: string
  email: string
  createdAt: string
}

const ROLES = [
  { value: "DOCTOR", label: "Doctor" },
  { value: "ASSISTANT", label: "Assistant" },
  { value: "MOTHER", label: "Mother" },
  { value: "ADMIN", label: "Admin" },
]

export function PendingUsers() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState<Record<string, boolean>>({})

  const fetchUsers = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch("/api/users/pending")
      if (!res.ok) {
        if (res.status === 403) {
          setError("Only admins can manage user roles.")
          return
        }
        throw new Error("Failed to fetch")
      }
      const data = await res.json()
      setUsers(data)
    } catch {
      setError("Could not load pending users.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchUsers()
    }, 0)
    window.addEventListener("user-registered", fetchUsers)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("user-registered", fetchUsers)
    }
  }, [fetchUsers])

  async function handleAssignRole(userId: string) {
    const role = selectedRoles[userId]
    if (!role) return

    setUpdating((prev) => ({ ...prev, [userId]: true }))
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update role")
      }

      // Remove from list
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setSelectedRoles((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }))
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // ── Loading state ──────────────────────────────────
  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <UserCheckIcon className="size-5 text-primary" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Users waiting for role assignment
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  // ── Error / non-admin state ────────────────────────
  if (error) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-muted-foreground" />
              Pending Approvals
            </CardTitle>
            <CardDescription>User role management</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  // ── Empty state ────────────────────────────────────
  if (users.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <UserCheckIcon className="size-5 text-primary" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Users waiting for role assignment
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-semibold px-2.5 py-0.5">
            0 Pending
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <ClockIcon className="size-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              No pending users. All accounts have been assigned roles.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Users table ────────────────────────────────────
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <UserCheckIcon className="size-5 text-primary" />
            Pending Approvals
          </CardTitle>
          <CardDescription>
            Assign roles to newly registered users
          </CardDescription>
        </div>
        <Badge variant="outline" className="font-semibold px-2.5 py-0.5">
          {users.length} Pending
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Assign Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MailIcon className="size-3.5" />
                    {user.email}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      value={selectedRoles[user.id] ?? ""}
                      onValueChange={(value) =>
                        setSelectedRoles((prev) => ({
                          ...prev,
                          [user.id]: value,
                        }))
                      }
                    >
                      <SelectTrigger size="sm" className="w-28">
                        <SelectValue placeholder="Role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="default"
                      disabled={!selectedRoles[user.id] || updating[user.id]}
                      onClick={() => handleAssignRole(user.id)}
                    >
                      {updating[user.id] ? "..." : "Assign"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
