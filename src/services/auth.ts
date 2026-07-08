import type { AppUser } from "@/types/user";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  name: string;
  email: string;
  password: string;
};

async function fetchJson<T>(url: string, options: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...options });
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload?.error || "Authentication failed");
  }
  return payload as T;
}

export async function login(credentials: AuthCredentials) {
  return fetchJson<{ success: true; user: AppUser }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function signup(credentials: SignupCredentials) {
  return fetchJson<{ success: true; user: AppUser }>("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function logout() {
  return fetchJson<{ success: true }>("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  const payload = await res.json();
  return payload.user as AppUser | null;
}
