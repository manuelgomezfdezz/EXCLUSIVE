import { NextResponse } from "next/server";
import { updateItem } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

// POST /api/admin/update  — protected, changes owner and/or status.
// Body: { item_id, owner_name?, status? }
// Transfer history is recorded automatically inside updateItem().
export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { item_id, owner_name, status } = body;

  if (!item_id) {
    return NextResponse.json({ error: "item_id is required" }, { status: 400 });
  }

  try {
    const updated = await updateItem(item_id, { owner_name, status });
    return NextResponse.json({ item: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
