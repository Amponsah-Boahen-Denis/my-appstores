import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";

export async function GET() {
  try {
    const db = await getDb();
    const stores = await db.collection("admin_moderation").find().toArray();
    const pending = stores.filter((s: { status?: string }) => s.status === "pending").length;
    const approved = stores.filter((s: { status?: string }) => s.status === "approved").length;
    const rejected = stores.filter((s: { status?: string }) => s.status === "rejected").length;
    const total = stores.length;
    return NextResponse.json({ pending, approved, rejected, total });
  } catch (error) {
    console.error("Admin moderation stats error:", error);
    return NextResponse.json({ error: "Failed to load moderation stats" }, { status: 500 });
  }
}
