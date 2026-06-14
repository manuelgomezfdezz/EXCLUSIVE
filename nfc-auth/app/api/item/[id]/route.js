import { NextResponse } from "next/server";
import { getItemById, getHistoryForItem } from "@/lib/db";

// GET /api/item/[id]  — public, read-only certificate data
export async function GET(_request, { params }) {
  const item = await getItemById(params.id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const history = await getHistoryForItem(params.id);

  return NextResponse.json({ item, history });
}
