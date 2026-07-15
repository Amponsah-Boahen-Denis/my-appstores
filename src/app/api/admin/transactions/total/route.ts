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
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    const candidateNames = ["stripe_transactions", "stripe_payments", "transactions", "payments"];
    const collectionName = candidateNames.find((name) => collectionNames.includes(name));

    if (!collectionName) {
      return NextResponse.json({ totalAmount: 0, currency: "usd" });
    }

    const items = await db.collection(collectionName).find().toArray();
    const totalAmount = items.reduce((sum, item) => {
      const amount = typeof item.amount === "number" ? item.amount : item.amount?.value ?? 0;
      return sum + amount;
    }, 0);

    const currency = items.find((item) => typeof item.currency === "string" && item.currency.length > 0)?.currency || "usd";
    return NextResponse.json({ totalAmount, currency });
  } catch (error) {
    console.error("Admin transaction total error:", error);
    return NextResponse.json({ totalAmount: 0, currency: "usd" }, { status: 500 });
  }
}
