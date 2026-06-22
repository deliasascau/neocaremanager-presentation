import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MotherDashboard } from "./mother-dashboard"

export default async function MotherPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  if (session.role !== "MOTHER") {
    redirect("/dashboard")
  }

  return <MotherDashboard />
}