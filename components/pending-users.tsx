"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  UserCheckIcon,
  ClockIcon,
  MailIcon,
  ShieldCheckIcon,
  KeyRoundIcon,
  CopyIcon,
  CheckIcon,
  XCircleIcon,
} from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface PendingUser {
  id: string
  name: string
  email: string
  createdAt: string
}

interface PendingReset {
  id: string
  createdAt: string
  expiresAt: string
  user: { id: string; name: string; email: string }
}

const ROLES = [
  { value: "DOCTOR", label: "Doctor" },
  { value: "ASSISTANT", label: "Assistant" },
  { value: "MOTHER", label: "Mother" },
  { value: "ADMIN", label: "Admin" },
]

export function PendingUsers() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [resets, setResets] = useState<PendingReset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  const fetchUsers = useCallback(async () => {
    try {
      setError(null)
      const [usersRes, resetsRes] = await Promise.all([
        fetch("/api/users/pending"),
        fetch("/api/users/pending-resets"),
      ])

      if (!usersRes.ok) {
        if (usersRes.status === 403) {
          setError("Only admins can manage user roles.")
          return
        }
        throw new Error("Failed to fetch")
      }
      const usersData = await usersRes.json()
      setUsers(usersData)

      if (resetsRes.ok) {
        const resetsData = await resetsRes.json()
        setResets(Array.isArray(resetsData) ? resetsData : [])
      }
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

  async function handleGenerateResetLink(userId: string) {
    setUpdating((prev) => ({ ...prev, [`reset-${userId}`]: true }))
    try {
      const res = await fetch(`/api/users/${userId}/reset`, { method: "POST" })
      const data = await res.json()
      if (res.ok && data.resetUrl) {
        setGeneratedLinks((prev) => ({ ...prev, [userId]: data.resetUrl as string }))
        void fetchUsers()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating((prev) => ({ ...prev, [`reset-${userId}`]: false }))
    }
  }

  async function handleRejectReset(userId: string, tokenId: string) {
    setUpdating((prev) => ({ ...prev, [`reject-${tokenId}`]: true }))
    try {
      await fetch(`/api/users/${userId}/reset`, { method: "DELETE" })
      setResets((prev) => prev.filter((r) => r.id !== tokenId))
      setGeneratedLinks((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating((prev) => ({ ...prev, [`reject-${tokenId}`]: false }))
    }
  }

  async function handleCopy(userId: string, url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopied((prev) => ({ ...prev, [userId]: true }))
      setTimeout(() => setCopied((prev) => ({ ...prev, [userId]: false })), 2000)
    } catch {
      window.open(url, "_blank")
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
            <CardDescription>Users waiting for role assignment</CardDescription>
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

  // ── Main render ────────────────────────────────────
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <UserCheckIcon className="size-5 text-primary" />
            Pending Approvals
          </CardTitle>
          <CardDescription>Manage new accounts and password reset requests</CardDescription>
        </div>
        <Badge variant="outline" className="font-semibold px-2.5 py-0.5">
          {users.length + resets.length} Pending
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="accounts">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="accounts" className="flex-1 gap-1.5">
              <UserCheckIcon className="size-3.5" />
              New Accounts
              {users.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {users.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resets" className="flex-1 gap-1.5">
              <KeyRoundIcon className="size-3.5" />
              Password Resets
              {resets.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {resets.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── New Accounts Tab ───────────────────── */}
          <TabsContent value="accounts">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <ClockIcon className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No pending users. All accounts have been assigned roles.
                </p>
              </div>
            ) : (
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
                              setSelectedRoles((prev) => ({ ...prev, [user.id]: value }))
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
            )}
          </TabsContent>

          {/* ── Password Resets Tab ────────────────── */}
          <TabsContent value="resets">
            {resets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <KeyRoundIcon className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No pending password reset requests.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resets.map((reset) => {
                    const link = generatedLinks[reset.user.id]
                    return (
                      <TableRow key={reset.id}>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-medium text-sm">{reset.user.name}</p>
                            <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                              <MailIcon className="size-3" />
                              {reset.user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(reset.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(reset.expiresAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {link ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => handleCopy(reset.user.id, link)}
                              >
                                {copied[reset.user.id] ? (
                                  <>
                                    <CheckIcon className="size-3.5 text-green-600" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <CopyIcon className="size-3.5" />
                                    Copy link
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                disabled={updating[`reset-${reset.user.id}`]}
                                onClick={() => handleGenerateResetLink(reset.user.id)}
                              >
                                {updating[`reset-${reset.user.id}`] ? "..." : "Generate link"}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              disabled={updating[`reject-${reset.id}`]}
                              onClick={() => handleRejectReset(reset.user.id, reset.id)}
                            >
                              <XCircleIcon className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
