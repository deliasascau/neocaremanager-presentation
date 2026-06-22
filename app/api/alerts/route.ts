import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const alerts = await prisma.alert.findMany({
      where: { resolved: false },
      include: {
        incubator: {
          select: { code: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = alerts.map((a) => ({
      id: a.id,
      message: a.message,
      type: a.type,
      priority: a.priority,
      incubatorCode: a.incubator.code,
      time: a.createdAt.toISOString(),
    }));

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Alerts list error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const body = await request.json();
    const { incubatorId, message, type, priority } = body;

    if (!incubatorId || !message || !type || !priority) {
      return NextResponse.json(
        { error: "incubatorId, message, type, and priority are required." },
        { status: 400 }
      );
    }

    const incubator = await prisma.incubator.findUnique({ where: { id: incubatorId } });
    if (!incubator) {
      return NextResponse.json({ error: "Incubator not found." }, { status: 404 });
    }

    const alert = await prisma.alert.create({
      data: {
        incubatorId,
        message,
        type,
        priority,
      },
      include: {
        incubator: { select: { code: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        alert: {
          id: alert.id,
          message: alert.message,
          type: alert.type,
          priority: alert.priority,
          incubatorCode: alert.incubator.code,
          time: alert.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create alert error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}