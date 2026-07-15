import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { AppUser } from "@/types/user";
import { getDb } from "@/lib/mongoServer";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hashedPassword: string) {
  return hashPassword(password) === hashedPassword;
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const db = await getDb();
  const token = createSessionToken();
  const now = Date.now();
  await db.collection("sessions").insertOne({
    token,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return token;
}

export async function getSession(token: string) {
  const db = await getDb();
  return db.collection("sessions").findOne({
    token,
    expiresAt: { $gt: Date.now() },
  });
}

export async function getUserBySessionToken(token: string) {
  const session = await getSession(token);
  if (!session) return null;

  const db = await getDb();
  const user = await db.collection("users").findOne({ id: session.userId, status: "active" });
  return user as AppUser | null;
}

export function createAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
    sameSite: "lax",
  });
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return getUserBySessionToken(token);
}
