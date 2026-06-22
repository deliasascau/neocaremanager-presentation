import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AlertDetailClient } from "./alert-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlertDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const { id } = await params;

  const alert = await prisma.alert.findUnique({
    where: { id },
    include: {
      incubator: {
        select: {
          code: true,
          ward: true,
          status: true,
          temperature: true,
          humidity: true,
          oxygenLevel: true,
        },
      },
    },
  });

  if (!alert) {
    return <div className="p-8 text-center text-muted-foreground">Alert not found.</div>;
  }

  return (
    <AlertDetailClient
      alert={{
        id: alert.id,
        message: alert.message,
        type: alert.type,
        priority: alert.priority,
        resolved: alert.resolved,
        createdAt: alert.createdAt.toISOString(),
        incubator: alert.incubator,
      }}
    />
  );
}