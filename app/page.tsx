"use client"

import Link from "next/link"
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react"
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
      </motion.nav>

      <section className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-3xl flex-col items-center justify-center py-10 text-center">
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

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
      </section>
    </main>
  )
}
