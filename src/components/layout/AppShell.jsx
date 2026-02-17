import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import toast from "react-hot-toast"; // Import toast

export default function AppShell({ children }) {
  const [serviceDown, setServiceDown] = useState(false);

  useEffect(() => {
    // 1. Service Down (500)
    const onServiceUnavailable = () => setServiceDown(true);

    // 2. Rate Limit (429) - New Listener
    const onRateLimit = (e) => {
      const seconds = e.detail?.retryAfter ?? 30;
      // Prevent spamming toasts if multiple requests fail at once
      toast.error(`Rate limit hit. Pausing for ${seconds}s`, {
        id: "rate-limit-toast", 
      });
    };

    window.addEventListener("app:service-unavailable", onServiceUnavailable);
    window.addEventListener("app:rate-limited", onRateLimit);

    return () => {
      window.removeEventListener("app:service-unavailable", onServiceUnavailable);
      window.removeEventListener("app:rate-limited", onRateLimit);
    };
  }, []);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      {serviceDown && (
        <div className="bg-rose-600 text-white py-2 text-center text-sm font-medium animate-pulse">
          ⚠️ Service Unavailable — We are experiencing backend instability.
          <button
            className="ml-4 underline hover:text-rose-200"
            onClick={() => setServiceDown(false)}
          >
            Dismiss
          </button>
        </div>
      )}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4">
        {children}
      </main>
    </div>
  );
}