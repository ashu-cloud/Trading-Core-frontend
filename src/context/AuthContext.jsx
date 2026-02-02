import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { ROUTES } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /**
   * Cookie-based session probe
   * If this succeeds → user is authenticated
   * If this fails (401) → not authenticated
   */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (!isError && data) {
      // We don’t need real user data, just session truth
      setUser({ authenticated: true });
    } else {
      setUser(null);
    }
  }, [data, isError]);

  const login = async (payload) => {
    await api.post("/auth/login", payload);
    window.location.replace(ROUTES.dashboard);
  };

  const signup = async (payload) => {
    await api.post("/auth/sign-up", payload);
    window.location.replace(ROUTES.dashboard);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      window.location.replace(ROUTES.login);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
