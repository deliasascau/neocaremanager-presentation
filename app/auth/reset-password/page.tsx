import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { ResetPasswordForm } from "./reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = "" } = await searchParams

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

        <ResetPasswordForm token={token} />
      </div>
    </main>
  )
}
