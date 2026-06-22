"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeftIcon, CheckCircle2Icon, GalleryVerticalEndIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FormState = {
	name: string
	email: string
	password: string
	confirmPassword: string
}

const initialState: FormState = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
}

const slideUp = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
}

const imageReveal = {
	initial: { opacity: 0, scale: 0.985 },
	animate: { opacity: 1, scale: 1 },
}

export function RegisterForm() {
	const [form, setForm] = useState<FormState>(initialState)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const { name, value } = event.target
		setForm((current) => ({ ...current, [name]: value }))
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)
		setSuccess(null)

		if (form.password.length < 8) {
			setError("Password must be at least 8 characters long.")
			return
		}

		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.")
			return
		}

		setIsSubmitting(true)
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					password: form.password,
				}),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || "Registration failed.")
				return
			}

			setSuccess("Account created successfully. Redirecting...")
			setForm(initialState)
			// Notify admin panel
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("user-registered"))
			}
			// Auto-login sets cookie, redirect to the appropriate page
			// PENDING users go to /pending
			window.location.href = "/pending"
		} catch {
			setError("Something went wrong. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

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
							className="w-full max-w-lg rounded-3xl border border-border/70 bg-card/90 p-6 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
							variants={slideUp}
							initial="initial"
							animate="animate"
							transition={{ duration: 0.55, ease: "easeOut", delay: 0.18 }}
						>
						<motion.div
							className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
							variants={slideUp}
							initial="initial"
							animate="animate"
							transition={{ duration: 0.45, ease: "easeOut", delay: 0.06 }}
						>
							<Link href="/auth/login" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
								<ArrowLeftIcon className="size-4" />
								Back to login
							</Link>
						</motion.div>

						<FieldGroup>
							<motion.div
								className="space-y-2 text-left"
								variants={slideUp}
								initial="initial"
								animate="animate"
								transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
							>
								<h1 className="text-3xl font-semibold tracking-tighter text-balance">
									Create your account
								</h1>
								<p className="text-sm leading-6 text-pretty text-muted-foreground">
									Set up your staff access in a few seconds.
								</p>
							</motion.div>

							<motion.form
								className="flex flex-col gap-6"
								onSubmit={handleSubmit}
								variants={slideUp}
								initial="initial"
								animate="animate"
								transition={{ duration: 0.55, ease: "easeOut", delay: 0.16 }}
							>
								{error ? <FieldError>{error}</FieldError> : null}
								{success ? (
									<div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm text-foreground">
										<CheckCircle2Icon className="size-4 text-primary" />
										{success}
									</div>
								) : null}

								<Field>
									<FieldLabel htmlFor="name">Full name</FieldLabel>
									<Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Maria Popescu" required className="bg-background" />
								</Field>

								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="m@example.com" required className="bg-background" />
								</Field>

								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="bg-background" />
									<FieldDescription>Use at least 8 characters.</FieldDescription>
								</Field>

								<Field>
									<FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
									<Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="bg-background" />
								</Field>

								<Button type="submit" className="font-medium" disabled={isSubmitting}>
									{isSubmitting ? "Creating account..." : "Create account"}
								</Button>

								<FieldDescription className="text-center">
									Already have an account?{" "}
									<Link href="/auth/login" className="underline underline-offset-4">
										Sign in
									</Link>
								</FieldDescription>
							</motion.form>
						</FieldGroup>
					</motion.div>
					</div>
				</section>

				<motion.section
					className="relative hidden overflow-hidden lg:block"
					variants={imageReveal}
					initial="initial"
					animate="animate"
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.24 }}
				>
					<img
						src="/medicine.svg"
						alt="Register illustration"
						className="absolute inset-0 h-full w-full object-contain object-center dark:brightness-[0.2] dark:grayscale"
					/>
				</motion.section>
			</div>
		</main>
	)
}
