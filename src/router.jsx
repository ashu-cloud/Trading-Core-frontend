import React from "react";
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import AllStocks from "./pages/AllStocks"; 
import Orders from "./pages/Orders";
import Portfolio from "./pages/Portfolio";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppShell from "./components/layout/AppShell"; 

function RouteErrorElement() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <h1 className="mb-2 text-lg font-semibold">Something went wrong</h1>
      <p className="mb-4 text-sm text-slate-400">
        The trading UI hit an unexpected error while resolving this route.
      </p>
      <a
        href="/dashboard"
        className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
      >
        Back to dashboard
      </a>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: "/login",
    element: <Navigate to="/auth" replace />,
  },
  {
    element: <ProtectedRoute />, 
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/market",
        element: <Market />, 
      },
     
      {
        path: "/market/all",
        element: <AllStocks />, 
      },
      // -----------------------------
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;