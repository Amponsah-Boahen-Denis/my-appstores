import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";
import { getUserFromRequest } from "@/lib/auth";
import { AppUser, UserStatus } from "@/types/user";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const users = await db.collection<AppUser>("admin_users").find().sort({ updatedAt: -1 }).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { id?: string; status?: UserStatus };

    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection<AppUser>("admin_users").findOneAndUpdate(
      { id: body.id },
      { $set: { status: body.status, updatedAt: Date.now() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
