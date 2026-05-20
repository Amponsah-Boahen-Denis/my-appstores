import { StoreSubmission } from "@/services/userStores";

export type StoreStatus = "pending" | "approved" | "rejected";

export type ModeratedStore = StoreSubmission & {
  status: StoreStatus;
  moderatedBy?: string;
  moderatedAt?: number;
  rejectionReason?: string;
};

export async function getPendingStores(): Promise<ModeratedStore[]> {
  const res = await fetch("/api/admin/moderation?status=pending");
  if (!res.ok) {
    throw new Error(`Failed to load pending moderation items: ${res.status}`);
  }
  return (await res.json()) as ModeratedStore[];
}

export async function getAllModeratedStores(): Promise<ModeratedStore[]> {
  const res = await fetch("/api/admin/moderation");
  if (!res.ok) {
    throw new Error(`Failed to load moderation items: ${res.status}`);
  }
  return (await res.json()) as ModeratedStore[];
}

export async function approveStore(storeId: string, adminId: string): Promise<void> {
  const res = await fetch("/api/admin/moderation", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: storeId, action: "approve", adminId }),
  });
  if (!res.ok) {
    throw new Error(`Failed to approve store: ${res.status}`);
  }
}

export async function rejectStore(storeId: string, adminId: string, reason: string): Promise<void> {
  const res = await fetch("/api/admin/moderation", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: storeId, action: "reject", adminId, reason }),
  });
  if (!res.ok) {
    throw new Error(`Failed to reject store: ${res.status}`);
  }
}

export async function submitStoreForModeration(store: StoreSubmission): Promise<void> {
  const res = await fetch("/api/admin/moderation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...store, status: "pending" }),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit store for moderation: ${res.status}`);
  }
}

export async function getModerationStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
  const res = await fetch("/api/admin/moderation/stats");
  if (!res.ok) {
    throw new Error(`Failed to load moderation stats: ${res.status}`);
  }
  return (await res.json()) as { pending: number; approved: number; rejected: number; total: number };
}
