import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getDb } from "@/lib/mongoServer";

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function passwordIsValid(password: string) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { token?: string; password?: string };
    const token = body.token?.trim();
    const password = body.password || "";

    if (!token || !passwordIsValid(password)) {
      return NextResponse.json(
        { error: "Use a password with at least 8 characters, including a letter and a number" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const resetToken = await db.collection("password_reset_tokens").findOne({
      tokenHash: hashResetToken(token),
      expiresAt: { $gt: Date.now() },
    });

    if (!resetToken) {
      return NextResponse.json({ error: "This reset link is invalid or expired" }, { status: 400 });
    }

    const result = await db.collection("users").updateOne(
      { id: resetToken.userId, status: "active" },
      { $set: { password: hashPassword(password), updatedAt: Date.now() } }
    );

    if (result.matchedCount !== 1) {
      return NextResponse.json({ error: "This reset link is invalid or expired" }, { status: 400 });
    }

    await db.collection("password_reset_tokens").deleteOne({ _id: resetToken._id });
    await db.collection("sessions").deleteMany({ userId: resetToken.userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Unable to reset password" }, { status: 500 });
  }
}
