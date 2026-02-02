import React, { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/features/auth/LoginForm";
import RegisterForm from "../components/features/auth/RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="relative hidden flex-1 items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.35),transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.25),transparent_60%)]" />
        <div className="relative max-w-md space-y-4 px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
            Institutional-grade trading,{" "}
            <span className="text-indigo-400">for builders</span>.
          </h1>
          <p className="text-sm text-slate-300">
            Trading Core models real brokerage flows: reserved balances,
            explicit execution, and auditable order lifecycles.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="rounded-lg bg-slate-900/70 p-3">
              <p className="font-medium text-emerald-400">ACID-safe</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Wallets and portfolios updated only on executed orders.
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-3">
              <p className="font-medium text-indigo-400">Audit-Ready</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Every state transition is logged for compliance and debugging.
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-3">
              <p className="font-medium text-amber-400">Realistic</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Orders represent intent. Ownership exists only after fill.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-950 px-4 py-8">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-6 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Trading Core
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-50">
              {mode === "login" ? "Sign in" : "Create your account"}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === "login"
                ? "Access your trading dashboard and live portfolio."
                : "Spin up a new trading sandbox account in seconds."}
            </p>
          </div>

          <div className="mb-4 flex rounded-full border border-slate-800 bg-slate-900 p-1 text-xs">
            {["login", "signup"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className="relative flex-1 rounded-full py-1.5 text-center font-medium text-slate-300"
              >
                {mode === value && (
                  <motion.span
                    layoutId="auth-toggle"
                    className="absolute inset-0 z-0 rounded-full bg-slate-800"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {value === "login" ? "Login" : "Signup"}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
            <p className="text-[11px] text-slate-500">
              This UI talks to the{" "}
              <span className="font-medium text-slate-300">
                Trading Core Backend
              </span>{" "}
              running at <code className="text-[10px]">http://localhost:5000</code>{" "}
              in development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

