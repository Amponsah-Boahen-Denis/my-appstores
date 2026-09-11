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
    const count = await db.collection("stores").countDocuments();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Admin store count error:", error);
    return NextResponse.json({ error: "Failed to load store count" }, { status: 500 });
  }
}
