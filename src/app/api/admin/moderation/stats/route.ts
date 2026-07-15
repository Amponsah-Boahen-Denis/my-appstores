import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const stores = await db.collection("admin_moderation").find().toArray() as Array<{ status?: string }>;
    const pending = stores.filter((s) => s.status === "pending").length;
    const approved = stores.filter((s) => s.status === "approved").length;
    const rejected = stores.filter((s) => s.status === "rejected").length;
    const total = stores.length;
    return NextResponse.json({ pending, approved, rejected, total });
  } catch (error) {
    console.error("Admin moderation stats error:", error);
    return NextResponse.json({ error: "Failed to load moderation stats" }, { status: 500 });
  }
}
