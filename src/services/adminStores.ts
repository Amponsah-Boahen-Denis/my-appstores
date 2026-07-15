export async function getStoreCount(): Promise<number> {
  const res = await fetch("/api/admin/stores/stats");
  if (!res.ok) {
    throw new Error(`Failed to load store count: ${res.status}`);
  }
  const json = (await res.json()) as { count: number };
  return json.count;
}
