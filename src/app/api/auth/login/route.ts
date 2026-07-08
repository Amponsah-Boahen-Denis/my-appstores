import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword, createSession, createAuthCookie } from "@/lib/auth";
import { getDb } from "@/lib/mongoServer";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email: string; password: string };
    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, status: user.status } });
    return createAuthCookie(response, token);
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
