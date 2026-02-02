import React from "react";
import Navbar from "./Navbar";

export default function AppShell({ children }) {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4">
        {children}
      </main>
    </div>
  );
}

