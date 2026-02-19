import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { ROUTES, API } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // ✅ FIX 1: Single, stable state initialization
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // ✅ FIX 2: Background check that doesn't trigger redirects mid-render
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get(API.AUTH.ME);
        const userData = res.data?.user ?? res.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        if (err.response?.status === 401) {
          // Only clear if we actually had a session
          if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (payload) => {
    const res = await api.post(API.AUTH.LOGIN, payload);
    const { token, user: userData } = res.data;
    if (token) localStorage.setItem("token", token);
    const finalUser = userData ?? res.data;
    localStorage.setItem("user", JSON.stringify(finalUser));
    setUser(finalUser);
    window.location.replace(ROUTES.dashboard);
  };

const logout = async () => {
    try {
      // 2. Tell the server to destroy the HttpOnly cookie
      // (Adjust the route if your endpoint is different, e.g., /user/logout)
      await api.post("/auth/logout"); 
    } catch (error) {
      console.error("Server logout failed, clearing local state anyway", error);
    } finally {
      // 3. Destroy the frontend evidence
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      if (queryClient) queryClient.clear();
      
      // 4. Redirect to login
      window.location.replace("/auth");
    }
  };


const signup = async (userData) => {
    try {
      // 1. Make the request (Verify this URL matches your backend route!)
      const res = await api.post("/auth/sign-up", userData); 

      // 2. Grab the token and user from our newly fixed backend response
      const { token, user } = res.data;

      // 3. Save to localStorage
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        
        // 4. HARD REDIRECT: Bypass React Router's catch-all trap
        window.location.replace("/dashboard"); 
      }
      
      return res.data;
      
    } catch (error) {
      console.error("AuthContext Signup Error:", error);
      // Throw the error so your RegisterForm's catch block can display the red toast
      throw error; 
    }
  };

  // ✅ Removed useMemo to simplify and prevent potential dependency loops
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user || !!localStorage.getItem("token"),
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}