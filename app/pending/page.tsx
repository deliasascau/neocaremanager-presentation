"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClockIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (cancelled) return;

        if (data.name) setUserName(data.name);

        // If approved, redirect based on role
        if (data.role && data.role !== "PENDING") {
          if (data.role === "MOTHER") {
            router.push("/mother");
          } else {
            router.push("/dashboard");
          }
        }
      } catch {
        // ignore
      }
    }

    checkStatus();

    // Poll every 5 seconds until approved
    const interval = setInterval(checkStatus, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.replace("/auth/login");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <ClockIcon className="size-8 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Pending Approval
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {userName ? (
              <>
                Hi <span className="font-medium text-foreground">{userName}</span>, your
                account has been created but{" "}
                <span className="font-medium text-foreground">requires admin approval</span>{" "}
                before you can access the dashboard.
              </>
            ) : (
              <>
                Your account has been created but{" "}
                <span className="font-medium text-foreground">requires admin approval</span>{" "}
                before you can access the dashboard.
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            An administrator will review your account and assign you a role.
            You&apos;ll be notified once approved.
          </p>
        </div>

        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOutIcon className="size-4" />
          Sign out
        </Button>
      </div>
    </main>
  );
}