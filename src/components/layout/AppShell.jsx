import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function AppShell({ children }) {
  const [serviceDown, setServiceDown] = useState(false);

  useEffect(() => {
    // 1. Show banner on 500 error
    const onServiceUnavailable = () => setServiceDown(true);
    
    // 2. Hide banner automatically on any success (200 OK)
    const onServiceRestored = () => setServiceDown(false);

    window.addEventListener("app:service-unavailable", onServiceUnavailable);
    window.addEventListener("app:service-restored", onServiceRestored);

    return () => {
      window.removeEventListener("app:service-unavailable", onServiceUnavailable);
      window.removeEventListener("app:service-restored", onServiceRestored);
    };
  }, []);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      
      {/* Banner now auto-dismisses */}
      <div
        className={`bg-rose-600 text-white overflow-hidden transition-all duration-300 ease-in-out ${
          serviceDown ? "max-h-12 py-2" : "max-h-0 py-0"
        }`}
      >
        <div className="text-center text-sm font-medium">
          ⚠️ Service Unavailable — We are experiencing backend instability.
          <button
            className="ml-4 underline hover:text-rose-200"
            onClick={() => setServiceDown(false)}
          >
            Dismiss
          </button>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4">
        {children}
      </main>
    </div>
  );
}