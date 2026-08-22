"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
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
  );
}
