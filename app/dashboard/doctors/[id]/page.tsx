import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DoctorDetail } from "./doctor-detail"

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  const { id } = await params

  return <DoctorDetail doctorId={id} />
}