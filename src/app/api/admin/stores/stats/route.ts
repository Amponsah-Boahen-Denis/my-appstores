import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";

export async function GET() {
  try {
    const db = await getDb();
    const count = await db.collection("stores").countDocuments();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Admin store count error:", error);
    return NextResponse.json({ error: "Failed to load store count" }, { status: 500 });
  }
}
