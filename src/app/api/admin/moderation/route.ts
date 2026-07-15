import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const db = await getDb();
    const query = status ? { status } : {};
    const stores = await db.collection("admin_moderation").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(stores);
  } catch (error) {
    console.error("Admin moderation fetch error:", error);
    return NextResponse.json({ error: "Failed to load moderation stores" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json() as {
      id?: string;
      action?: "approve" | "reject";
      adminId?: string;
      reason?: string;
    };

    if (!body.id || !body.action || !body.adminId) {
      return NextResponse.json({ error: "Missing id, action, or adminId" }, { status: 400 });
    }

    const db = await getDb();
    const update: Record<string, unknown> = {
      status: body.action === "approve" ? "approved" : "rejected",
      moderatedBy: body.adminId,
      moderatedAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (body.action === "reject") {
      update.rejectionReason = body.reason || "No reason provided";
    }

    const result = await db.collection("admin_moderation").findOneAndUpdate(
      { id: body.id },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Moderation item not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin moderation update error:", error);
    return NextResponse.json({ error: "Failed to update moderation item" }, { status: 500 });
  }
}
