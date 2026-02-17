import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { ROUTES, API } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Session Probe
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get(API.AUTH.ME);
        setUser(res.data?.user ?? res.data);
      } catch (err) {
        // 401 is expected if not logged in; don't treat as error
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Global Event Listener for Session Expiry
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      // Only redirect if we are inside a protected route to avoid loops
      const isPublicRoute = window.location.pathname.startsWith("/auth");
      if (!isPublicRoute) {
        window.location.replace(ROUTES.login);
      }
    };

    window.addEventListener("app:unauthorized", onUnauthorized);
    return () => window.removeEventListener("app:unauthorized", onUnauthorized);
  }, []);

  const login = async (payload) => {
    const res = await api.post(API.AUTH.LOGIN, payload);
    setUser(res.data?.user ?? res.data);
    window.location.replace(ROUTES.dashboard);
  };

  const signup = async (payload) => {
    const res = await api.post(API.AUTH.SIGNUP, payload);
    setUser(res.data?.user ?? res.data);
    window.location.replace(ROUTES.dashboard);
  };

  const logout = async () => {
    try {
      await api.post(API.AUTH.LOGOUT);
    } finally {
      setUser(null);
      queryClient.clear();
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}