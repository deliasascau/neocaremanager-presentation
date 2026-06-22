import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "neocare-dev-secret-change-in-production-min-32-chars!!"
);

const COOKIE_NAME = "neocare-token";

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/login"];
const API_PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];
const PENDING_ALLOWED = ["/pending", "/api/auth/logout", "/api/auth/me"];

async function verifyAuth(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; email: string; name: string; role: string };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public API routes
  if (API_PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyAuth(token) : null;

  // ── Protected routes: redirect to login if not authenticated ──
  const isProtected =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/api/") &&
      !API_PUBLIC_PATHS.some((p) => pathname.startsWith(p)));

  if (isProtected && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth pages: redirect to dashboard if already authenticated ──
  const isAuthPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthPage && user) {
    // PENDING users go to /pending, not dashboard
    if (user.role === "PENDING") {
      return NextResponse.redirect(new URL("/pending", request.url));
    }
    if (user.role === "MOTHER") {
      return NextResponse.redirect(new URL("/mother", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── PENDING users: only allow /pending, logout, and /me ──
  if (user && user.role === "PENDING") {
    const isPendingAllowed = PENDING_ALLOWED.some((p) => pathname.startsWith(p));
    if (!isPendingAllowed) {
      return NextResponse.redirect(new URL("/pending", request.url));
    }
  }

  // ── MOTHER users: no dashboard access, but allow /api/mother/ ──
  if (
    user &&
    user.role === "MOTHER" &&
    (pathname.startsWith("/dashboard") ||
      (pathname.startsWith("/api/") &&
        !API_PUBLIC_PATHS.some((p) => pathname.startsWith(p)) &&
        !pathname.startsWith("/api/auth/") &&
        !pathname.startsWith("/api/mother/")))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
