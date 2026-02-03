import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function AppShell({ children }) {
  const [serviceDown, setServiceDown] = useState(false);

  useEffect(() => {
    const onServiceUnavailable = () => setServiceDown(true);
    window.addEventListener("app:service-unavailable", onServiceUnavailable);
    return () => window.removeEventListener("app:service-unavailable", onServiceUnavailable);
  }, []);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      {serviceDown && (
        <div className="bg-rose-600 text-white py-2 text-center text-sm">
          Service Unavailable — some features may be degraded. We are working on it.
          <button
            className="ml-4 underline"
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

