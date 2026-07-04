import React, { useState } from "react";
import LoginForm from "../components/features/auth/LoginForm";
import RegisterForm from "../components/features/auth/RegisterForm";
import SoftAurora from "../components/bits/SoftAurora/SoftAurora";
import Orb from "../components/bits/Orb/Orb";
import SplitText from "../components/bits/SplitText/SplitText";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* LEFT PANEL - Split screen 50/50, hidden on mobile */}
      <div className="relative hidden md:flex flex-1 flex-col justify-between p-12 bg-slate-950 overflow-hidden border-r border-slate-900">
        
        {/* SoftAurora Background wrapped in opacity-50 */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
          <SoftAurora
            color1="#0f172a"
            color2="#4f46e5"
            speed={0.35}
            brightness={0.65}
            scale={1.8}
            enableMouse={false}
            enableMouseInteraction={false}
          />
        </div>

        {/* Decorative Circle Outlines for Depth */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute border border-white/[0.04] rounded-full" 
            style={{ 
              width: "600px", 
              height: "600px", 
              top: "20%", 
              left: "-10%",
              borderRadius: "9999px" 
            }} 
          />
          <div 
            className="absolute border border-white/[0.04] rounded-full" 
            style={{ 
              width: "350px", 
              height: "350px", 
              bottom: "15%", 
              right: "-5%",
              borderRadius: "9999px" 
            }} 
          />
        </div>

        {/* Floating 3D Orb Component centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div style={{ width: "420px", height: "420px" }}>
            <Orb
              hue={250}
              hoverIntensity={0.15}
              rotateOnHover={true}
              backgroundColor="#020617"
            />
          </div>
        </div>

        {/* Wordmark top-left */}
        <div className="relative z-20 text-left">
          <span className="text-lg font-bold tracking-tight text-slate-50">
            TradePulse
          </span>
        </div>

        {/* Heading and bullet points bottom */}
        <div className="relative z-20 max-w-md text-left space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-50">
            Institutional-grade trading, for builders.
          </h2>
          <div className="space-y-1.5 text-xs text-slate-400 font-sans font-medium">
            <p>— ACID-safe order execution</p>
            <p>— Every state change logged</p>
            <p>— Ownership exists only after fill</p>
          </div>
        </div>

      </div>

      {/* RIGHT PANEL - Centered floating form on dark background */}
      <div className="flex flex-1 items-center justify-center bg-slate-950 px-6 py-8 relative">
        <div className="w-full max-w-sm space-y-8 relative z-10">
          
          {/* Tracked Header */}
          <div className="space-y-3 text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 block">
              TRADEPULSE
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-50 block h-12">
              <SplitText
                key={mode} // Re-animate SplitText on mode change
                text={mode === "login" ? "Sign in." : "Sign up."}
                splitType="words"
                delay={40}
                duration={0.6}
              />
            </h1>
          </div>

          {/* Toggle tabs as plain text with active underline */}
          <div className="flex gap-6 border-b border-slate-900 pb-1 text-xs font-semibold tracking-wide uppercase font-sans">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`relative pb-3 transition-colors ${
                mode === "login" 
                  ? "text-slate-50 border-b-2 border-indigo-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`relative pb-3 transition-colors ${
                mode === "signup" 
                  ? "text-slate-50 border-b-2 border-indigo-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Signup
            </button>
          </div>

          {/* Form logic */}
          <div className="space-y-4">
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
            
            {/* Bottom Backend Indicator with small static green dot */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-6 border-t border-slate-900/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Connected to Trading Core Backend</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
