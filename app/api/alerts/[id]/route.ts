import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const { id } = await params;

    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        incubator: {
          select: {
            code: true,
            ward: { select: { name: true } },
            status: true,
            temperature: true,
            humidity: true,
            oxygenLevel: true,
          },
        },
      },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: alert.id,
      message: alert.message,
      type: alert.type,
      priority: alert.priority,
      resolved: alert.resolved,
      createdAt: alert.createdAt.toISOString(),
      incubator: {
        code: alert.incubator.code,
        ward: alert.incubator.ward.name,
        status: alert.incubator.status,
        temperature: alert.incubator.temperature,
        humidity: alert.incubator.humidity,
        oxygenLevel: alert.incubator.oxygenLevel,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Alert detail error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN", "DOCTOR", "ASSISTANT");

    const { id } = await params;
    const body = await request.json();
    const { resolved, freeIncubator } = body;

    if (typeof resolved !== "boolean") {
      return NextResponse.json(
        { error: "resolved (boolean) is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.alert.findUnique({
      where: { id },
      select: { incubatorId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Alert not found." }, { status: 404 });
    }

    const alert = await prisma.alert.update({
      where: { id },
      data: { resolved },
    });

    // Only free an incubator when it has no active admission.
    if (resolved && freeIncubator) {
      const activeAdmission = await prisma.admission.findFirst({
        where: { incubatorId: existing.incubatorId, dischargedAt: null },
      });

      if (!activeAdmission) {
        await prisma.incubator.update({
          where: { id: existing.incubatorId },
          data: { status: "AVAILABLE" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      alert: {
        id: alert.id,
        message: alert.message,
        type: alert.type,
        priority: alert.priority,
        resolved: alert.resolved,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update alert error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
