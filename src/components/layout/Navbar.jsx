import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: ROUTES.dashboard, label: "Dashboard" },
    { to: ROUTES.market, label: "Market" },
    { to: ROUTES.orders, label: "Orders" },
    { to: ROUTES.portfolio, label: "Portfolio" },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard)}
          className="flex items-center gap-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-xs font-semibold">
            TC
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            Trading Core
          </span>
        </button>
        <nav className="hidden items-center gap-4 text-sm text-slate-400 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "px-2 py-1 transition-colors",
                  isActive
                    ? "text-slate-100"
                    : "hover:text-slate-100 hover:underline"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

