import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSession, createAuthCookie } from "@/lib/auth";
import { getDb } from "@/lib/mongoServer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = (await req.json()) as { name: string; email: string; password: string };
    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const user = {
      id,
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      status: "active",
      planType: "starter",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.collection("users").insertOne(user);
    const token = await createSession(id);
    const response = NextResponse.json({ success: true, user: { id, name, email: user.email, status: user.status } });
    return createAuthCookie(response, token);
  } catch (error) {
    console.error("Auth signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
