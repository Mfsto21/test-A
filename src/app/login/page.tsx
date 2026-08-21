"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { BuilderWordmark } from "@/components/logo-mark";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-6">
      <div className="bg-grain pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(169,121,63,0.25), transparent 55%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center">
          <BuilderWordmark tone="light" />
        </div>

        <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-8 shadow-soft backdrop-blur-sm">
          <p className="mb-1 text-[11px] uppercase tracking-widest2 text-bronze-400">
            Private Residence Access
          </p>
          <h1 className="mb-6 font-serif text-2xl text-paper">
            Welcome back.
          </h1>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-paper/60">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-paper outline-none transition focus:border-bronze-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-paper/60">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-paper outline-none transition focus:border-bronze-400"
                placeholder="••••••••"
              />
            </div>

            {state.error && (
              <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-lg bg-bronze-500 py-2.5 text-sm font-medium tracking-wide text-ink-900 transition hover:bg-bronze-400 disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Enter"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-widest2 text-paper/30">
          Northern &amp; Southern California · Lic #1069037
        </p>
      </div>
    </main>
  );
}
