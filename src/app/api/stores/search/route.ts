import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongoServer";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const product = searchParams.get("product")?.trim();
    const category = searchParams.get("category")?.trim();
    const country = searchParams.get("country")?.trim();
    const address = searchParams.get("address")?.trim();

    if (!product) {
      return NextResponse.json(
        { error: "Product query is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const limitParam = parseInt(searchParams.get("limit") || "20", 10);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 20;
    const escapedProduct = escapeRegex(product);

    const filters: Record<string, unknown>[] = [
      {
        $or: [
          { name: { $regex: escapedProduct, $options: "i" } },
          { category: { $regex: escapedProduct, $options: "i" } },
          { address: { $regex: escapedProduct, $options: "i" } },
        ],
      },
    ];

    if (category) {
      filters.push({ category: { $regex: escapeRegex(category), $options: "i" } });
    }

    if (country) {
      filters.push({ country: { $regex: escapeRegex(country), $options: "i" } });
    }

    if (address) {
      filters.push({ address: { $regex: escapeRegex(address), $options: "i" } });
    }

    const query = filters.length > 0 ? { $and: filters } : {};
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              {
                $cond: [
                  { $regexMatch: { input: "$name", regex: new RegExp(`^${escapedProduct}`, "i") } },
                  100,
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$name", regex: new RegExp(escapedProduct, "i") } },
                  50,
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$category", regex: new RegExp(escapedProduct, "i") } },
                  30,
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$address", regex: new RegExp(escapedProduct, "i") } },
                  20,
                  0,
                ],
              },
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1, updatedAt: -1 } },
      { $limit: limit },
    ];

    const stores = await db.collection("stores").aggregate(pipeline).toArray();

    const formattedResults = stores.map((store: any) => ({
      id: store.id,
      name: store.name,
      category: store.category || null,
      address: store.address,
      phone: store.phone || null,
      email: store.email || null,
      website: store.website || null,
      workingHours: store.workingHours || null,
      lat: store.lat ?? 0,
      lon: store.lon ?? 0,
      createdAt: store.createdAt,
    }));

    return NextResponse.json({
      results: formattedResults,
      count: formattedResults.length,
    });
  } catch (error) {
    console.error("Store search error:", error);
    return NextResponse.json(
      { error: "Failed to search stores" },
      { status: 500 }
    );
  }
}
