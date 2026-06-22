"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { GalleryVerticalEndIcon } from "lucide-react"
import { motion } from "framer-motion"

const slideUp = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
}

const imageReveal = {
	initial: { opacity: 0, scale: 0.985 },
	animate: { opacity: 1, scale: 1 },
}

export default function LoginPage() {
	return (
		<main
			className="relative min-h-svh overflow-hidden bg-background"
		>
			<div
				className="absolute inset-0 -z-10"
				style={{
					backgroundImage:
						"radial-gradient(circle at top left, rgba(24,24,27,0.08), transparent 34%), radial-gradient(circle at bottom right, rgba(24,24,27,0.06), transparent 30%), linear-gradient(to bottom right, var(--background), color-mix(in oklab, var(--muted) 20%, transparent))",
				}}
			/>

			<div
				className="absolute inset-0 -z-10"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgba(120,120,120,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,120,0.08) 1px, transparent 1px)",
					backgroundSize: "3rem 3rem",
					maskImage: "radial-gradient(ellipse at center, black, transparent 78%)",
					WebkitMaskImage:
						"radial-gradient(ellipse at center, black, transparent 78%)",
				}}
			/>

			<div className="grid min-h-svh w-full lg:grid-cols-2">
				<section className="flex flex-col gap-4 p-6 md:p-10">
					<motion.div
						className="flex justify-center gap-2 md:justify-start"
						variants={slideUp}
						initial="initial"
						animate="animate"
						transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
					>
						<Link href="/" className="flex items-center gap-2 font-medium">
							<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
								<GalleryVerticalEndIcon className="size-4" />
							</div>
							Neocare Manager
						</Link>
					</motion.div>
					<div className="flex flex-1 items-center justify-center">
						<motion.div
							className="w-full max-w-md rounded-3xl border border-border/70 bg-card/90 p-6 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
							variants={slideUp}
							initial="initial"
							animate="animate"
							transition={{ duration: 0.55, ease: "easeOut", delay: 0.18 }}
						>
							<LoginForm />
						</motion.div>
					</div>
				</section>
				<motion.section
					className="relative hidden overflow-hidden lg:block"
					variants={imageReveal}
					initial="initial"
					animate="animate"
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.22 }}
				>
					<img
						src="/medicine.svg"
						alt="Medical illustration"
						className="absolute inset-0 h-full w-full object-contain object-center dark:brightness-[0.2] dark:grayscale"
					/>
				</motion.section>
			</div>
		</main>
	)
}
