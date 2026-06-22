"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  DatabaseIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  ShieldCheckIcon,
  TerminalSquareIcon,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const dbHighlights = [
  {
    icon: LayoutGridIcon,
    label: "Modelul Relațional",
    desc: "Tabele, chei primare & externe, integritate referențială — fundamentul oricărui SGBD modern.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-200",
  },
  {
    icon: KeyRoundIcon,
    label: "Constrângeri de Integritate",
    desc: "NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK — reguli care garantează corectitudinea datelor.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-200",
  },
  {
    icon: DatabaseIcon,
    label: "Normalizarea (FN1–FN3 + BCNF)",
    desc: "Eliminarea redundanțelor și anomaliilor: FN1 → atomicitate, FN2 → fără dependențe parțiale, FN3 → fără dependențe tranzitive.",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    border: "border-violet-200",
  },
  {
    icon: TerminalSquareIcon,
    label: "SQL — DDL & DML",
    desc: "CREATE / ALTER / DROP pentru structură, SELECT / JOIN / GROUP BY / subinterogări pentru manipularea datelor.",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-200",
  },
]

export default function Home() {
  return (
    <motion.main
      className="min-h-svh bg-[#fafafa] px-6 py-10 text-[#1f2937] sm:px-10 lg:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-6xl items-center">
        <motion.section
          className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {/* ── Left column ── */}
          <div className="flex flex-col justify-center gap-8">

            <motion.div className="space-y-6" variants={fadeUp} transition={{ duration: 0.5 }}>
              <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                <span className="text-[#3b82f6]">Neocare</span>
                <br />
                <span className="text-[#1f2937]">Manager</span>
              </h1>
              <p className="max-w-xl text-pretty text-base leading-7 text-[#6b7280] sm:text-lg">
                O platformă securizată construită pe principii solide de baze de date relaționale:
                integritate, normalizare, constrângeri și interogări SQL.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="group h-14 gap-3 rounded-xl bg-[#3b82f6] px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-[#2563eb] hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <Link href="/auth/login">
                    <ShieldCheckIcon className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    Autentificare
                    <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group h-14 gap-3 rounded-xl border-[#d8e4e3] bg-white px-8 text-base font-semibold text-[#1f2937] transition-all duration-300 hover:border-[#3b82f6] hover:bg-[#e0f2f1] hover:text-[#1f2937] hover:shadow-md"
                >
                  <Link href="/dashboard">
                    <DatabaseIcon className="size-5 transition-transform duration-300 group-hover:rotate-6" />
                    Dashboard
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.p
              className="text-xs text-[#6b7280]"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Acces pe roluri · Date criptate · PostgreSQL + Prisma · Normalizat până la BCNF
            </motion.p>
          </div>

          {/* ── Right column – DB highlights ── */}
          <motion.div className="flex flex-col gap-4" variants={fadeUp} transition={{ duration: 0.6 }}>
            <motion.div className="mb-1 flex items-center gap-2" variants={fadeUp} transition={{ duration: 0.5 }}>
              <LayoutGridIcon className="size-4 text-[#3b82f6]" />
              <p className="text-sm font-medium uppercase tracking-wider text-[#6b7280]">
                Concepte-cheie — Baze de Date
              </p>
            </motion.div>

            {dbHighlights.map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                whileHover={{
                  scale: 1.02,
                  x: 4,
                  transition: { type: "spring", stiffness: 300, damping: 18 },
                }}
                className={`flex items-start gap-4 rounded-2xl border ${item.border} bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md`}
              >
                <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className={`size-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#1f2937]">{item.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Extra stats row */}
            <motion.div
              className="mt-2 grid grid-cols-3 gap-3"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { label: "SGBD", value: "PostgreSQL" },
                { label: "ORM", value: "Prisma" },
                { label: "Normalizare", value: "până la BCNF" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  className="rounded-xl border border-[#d8e4e3] bg-white p-3 text-center shadow-sm"
                  whileHover={{ y: -2, borderColor: "#3b82f6" }}
                >
                  <p className="text-xs font-medium text-[#6b7280]">{s.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#3b82f6]">{s.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </motion.main>
  )
}
