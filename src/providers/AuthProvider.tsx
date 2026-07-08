"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AppUser } from "@/types/user";
import { getCurrentUser, login as loginApi, logout as logoutApi, signup as signupApi } from "@/services/auth";
import type { AuthCredentials, SignupCredentials } from "@/services/auth";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<AppUser>;
  signup: (credentials: SignupCredentials) => Promise<AppUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const result = await loginApi(credentials);
    setUser(result.user);
    return result.user;
  };

  const signup = async (credentials: SignupCredentials) => {
    const result = await signupApi(credentials);
    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const refresh = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
