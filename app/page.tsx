"use client"

import Link from "next/link"
import { ActivityIcon, ArrowRightIcon, BabyIcon, ShieldCheckIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <main className="min-h-svh bg-[#f7fafc] px-6 py-8 text-[#111827] sm:px-10">
      <motion.nav
        className="mx-auto flex max-w-6xl items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Neocare Manager
        </Link>
        <Button asChild variant="outline" className="bg-white">
          <Link href="/auth/login">Autentificare</Link>
        </Button>
      </motion.nav>

      <section className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          className="space-y-7"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
            <ShieldCheckIcon className="size-4" />
            Management neonatal securizat
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Neocare Manager
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[#5f6b7a]">
              Aplicație pentru monitorizarea nou-născuților, incubatoarelor,
              internărilor active și alertelor medicale din secția neonatală.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 gap-2 rounded-xl px-6">
              <Link href="/auth/login">
                Intră în aplicație
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-white px-6">
              <Link href="/dashboard">Vezi dashboard</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.55)]"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Live overview</p>
              <h2 className="text-xl font-semibold">NICU Dashboard</h2>
            </div>
            <ActivityIcon className="size-6 text-blue-600" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Pacienți", value: "30", icon: BabyIcon },
              { label: "Incubatoare", value: "20", icon: ActivityIcon },
              { label: "Alerte active", value: "12", icon: ShieldCheckIcon },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <item.icon className="mb-3 size-5 text-blue-600" />
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-sm font-medium text-blue-900">Flux principal</p>
            <p className="mt-1 text-sm leading-6 text-blue-800/80">
              Adaugi pacientul, alegi incubatorul disponibil, urmărești internarea
              și gestionezi alertele din același dashboard.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
