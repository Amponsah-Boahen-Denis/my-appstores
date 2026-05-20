import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";
import { AppUser } from "@/types/user";

export async function GET() {
  try {
    const db = await getDb();
    const users = await db.collection<AppUser>("admin_users").find().toArray();
    const total = users.length;
    const blocked = users.filter((u) => u.status === "blocked").length;
    const onHold = users.filter((u) => u.status === "on_hold").length;
    const active = users.filter((u) => u.status === "active").length;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const registeredToday = users.filter((u) => u.createdAt >= startOfDay.getTime()).length;

    return NextResponse.json({ total, blocked, onHold, active, registeredToday });
  } catch (error) {
    console.error("Admin user stats error:", error);
    return NextResponse.json({ error: "Failed to load user stats" }, { status: 500 });
  }
}
