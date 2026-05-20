import { AppUser, UserStatus } from "@/types/user";

export async function listUsers(): Promise<AppUser[]> {
  const res = await fetch("/api/admin/users");
  if (!res.ok) {
    throw new Error(`Failed to load users: ${res.status}`);
  }
  return (await res.json()) as AppUser[];
}

export async function setUserStatus(id: string, status: UserStatus): Promise<void> {
  const res = await fetch("/api/admin/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update user status: ${res.status}`);
  }
}

export async function stats(): Promise<{ total: number; blocked: number; onHold: number; active: number; registeredToday: number; }> {
  const res = await fetch("/api/admin/users/stats");
  if (!res.ok) {
    throw new Error(`Failed to load user stats: ${res.status}`);
  }
  return (await res.json()) as { total: number; blocked: number; onHold: number; active: number; registeredToday: number };
}



