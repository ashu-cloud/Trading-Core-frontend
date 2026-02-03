import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { ROUTES } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // Explicit local loading state (defaults to true to avoid flicker)
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Cookie-based session probe
   * If this succeeds → user is authenticated
   * If this fails (401) → not authenticated
   */
  const { data, isError, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    // keep explicit loading state in-sync with react-query
    setIsLoading(isFetching);
  }, [isFetching]);

  useEffect(() => {
    if (!isError && data) {
      // set the actual user returned from server when available
      setUser(data?.user ?? data);
    } else if (isError) {
      setUser(null);
    }
  }, [data, isError]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      // avoid redirect loop
      if (window.location.pathname !== ROUTES.login) {
        window.location.replace(ROUTES.login);
      }
    };

    window.addEventListener("app:unauthorized", onUnauthorized);
    return () => window.removeEventListener("app:unauthorized", onUnauthorized);
  }, []);

  const login = async (payload) => {
    // payload should be { email, password }
    const res = await api.post("/auth/login", payload);
    setUser(res.data?.user ?? res.data);
    // Invalidate user-related caches
    queryClient.invalidateQueries({ queryKey: ["user"] });
    window.location.replace(ROUTES.dashboard);
  };

  const signup = async (payload) => {
    // Backend route: POST /api/auth/register
    const res = await api.post("/auth/register", payload);
    setUser(res.data?.user ?? res.data);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    window.location.replace(ROUTES.dashboard);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
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
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
