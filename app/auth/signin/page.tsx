"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { IconSparkles, IconLoader2, IconAlertCircle, IconEye, IconEyeOff } from "@tabler/icons-react";

// ─── Sign-in form ─────────────────────────────────────────────────────────────

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("test@team.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? "Sign-in failed. Check your credentials and try again." : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password. Use test@team.com / password.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 shadow-lg">
            <IconSparkles className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-neutral-800">FloorSwap AI</h1>
            <p className="text-sm text-neutral-500">Visualize your dream floor</p>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-xl">
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-lg font-bold text-neutral-800">Sign in</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Use the team credentials below.
            </p>

            {/* Demo hint */}
            <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-medium text-sky-700">
                Demo credentials pre-filled:
              </p>
              <p className="mt-0.5 font-mono text-xs text-sky-600">
                test@team.com&nbsp;/&nbsp;password
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="signin-email"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-100"
                  placeholder="test@team.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="signin-password"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-11 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-100"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="signin-submit-btn"
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-neutral-400">
              Free to use · No credit card · Your images are private
            </p>
          </div>

          {/* Footer stripe */}
          <div className="border-t border-neutral-50 bg-neutral-50 px-8 py-4">
            <p className="text-center text-xs text-neutral-400">
              This is a team PoC.{" "}
              <span className="text-neutral-500 font-medium">
                Switch to Google OAuth
              </span>{" "}
              before public launch.
            </p>
          </div>
        </div>
      </div>

      {/* Floating dock clearance */}
      <div className="pb-24" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
