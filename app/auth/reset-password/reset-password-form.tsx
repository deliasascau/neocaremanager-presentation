"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle2Icon, KeyRoundIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError("Missing reset token.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not reset password.")
        return
      }

      setSuccess(true)
      setPassword("")
      setConfirmPassword("")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FieldGroup>
      <div className="space-y-2 text-left">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRoundIcon className="size-5" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tighter">Choose a new password</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Use at least 8 characters. After reset, sign in with the new password.
        </p>
      </div>

      {success ? (
        <div className="rounded-lg border border-border bg-secondary/60 px-3 py-3 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-primary" />
            Password updated successfully.
          </div>
          <Button asChild className="mt-3 w-full">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error ? <FieldError>{error}</FieldError> : null}
          {!token ? (
            <FieldError>
              This page needs a reset token. Generate a new link from the forgot password page.
            </FieldError>
          ) : null}

          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="bg-background"
            />
            <FieldDescription>Use at least 8 characters.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="bg-background"
            />
          </Field>

          <Button type="submit" disabled={isSubmitting || !token}>
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      )}
    </FieldGroup>
  )
}
