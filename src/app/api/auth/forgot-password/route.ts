import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;
const GENERIC_RESPONSE = {
  message: "If an account exists for that email, a password reset link has been sent.",
};

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getAppUrl(req: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
}

async function sendResetEmail(email: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(`Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your Ampden password",
      html: `<p>We received a request to reset your Ampden password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Reset email delivery failed: ${response.status}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email, status: "active" });

    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const rawToken = randomBytes(32).toString("hex");
    const now = Date.now();
    await db.collection("password_reset_tokens").deleteMany({ userId: user.id });
    await db.collection("password_reset_tokens").insertOne({
      userId: user.id,
      tokenHash: hashResetToken(rawToken),
      createdAt: now,
      expiresAt: now + RESET_TOKEN_TTL_MS,
    });

    const resetUrl = `${getAppUrl(req)}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendResetEmail(email, resetUrl);

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process the password reset request" },
      { status: 500 }
    );
  }
}
