export async function totalTransactions(): Promise<{ totalAmount: number; currency: string }> {
  const res = await fetch("/api/admin/transactions/total");
  if (!res.ok) {
    throw new Error(`Failed to load transaction total: ${res.status}`);
  }
  return (await res.json()) as { totalAmount: number; currency: string };
}
