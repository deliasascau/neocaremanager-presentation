"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeftIcon, CheckCircle2Icon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setResetUrl(null)
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not generate reset link.")
        return
      }

      setMessage(data.message || "Reset link generated.")
      setResetUrl(data.resetUrl || null)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-background px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-6 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.45)] sm:p-8">
        <Link
          href="/auth/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to login
        </Link>

        <FieldGroup>
          <div className="space-y-2 text-left">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MailIcon className="size-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tighter">Reset your password</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Enter your account email and the app will generate a reset link.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error ? <FieldError>{error}</FieldError> : null}
            {message ? (
              <div className="rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 text-primary" />
                  {message}
                </div>
                {resetUrl ? (
                  <Button asChild className="mt-3 w-full">
                    <Link href={resetUrl}>Open reset page</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="bg-background"
              />
              <FieldDescription>
                For the presentation build, the reset link is shown here instead of being emailed.
              </FieldDescription>
            </Field>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate reset link"}
            </Button>
          </form>
        </FieldGroup>
      </div>
    </main>
  )
}
