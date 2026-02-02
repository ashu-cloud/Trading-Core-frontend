import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { ROUTES } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      // Prefer /api/auth/me if available; as a fallback we can fetch wallet
      const res = await api.get("/auth/me").catch(async (err) => {
        if (err?.response?.status === 404) {
          const walletRes = await api.get("/wallet/balance");
          return { walletBalance: walletRes.data?.balance ?? 0 };
        }
        throw err;
      });
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (data && !isError) {
      setUser(data);
    }
    if (isError) {
      setUser(null);
    }
  }, [data, isError]);

  const login = async (payload) => {
    await api.post("/auth/login", payload);
    window.location.href = ROUTES.dashboard;
  };

  const signup = async (payload) => {
    await api.post("/auth/signup", payload);
    window.location.href = ROUTES.dashboard;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      window.location.href = ROUTES.login;
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

