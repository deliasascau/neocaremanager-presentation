import { NextResponse } from "next/server";
import { getSession, setSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Check DB for the real role (JWT may be stale after admin assigns a role)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, name: true },
    });

    if (dbUser && dbUser.role !== user.role) {
      // Role changed — refresh the session cookie
      await setSession({
        id: user.id,
        email: user.email,
        name: dbUser.name,
        role: dbUser.role as "PENDING" | "ADMIN" | "DOCTOR" | "ASSISTANT" | "MOTHER",
      });

      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: dbUser.name,
        role: dbUser.role,
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}