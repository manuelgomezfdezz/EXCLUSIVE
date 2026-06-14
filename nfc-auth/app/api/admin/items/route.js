import { NextResponse } from "next/server";
import { getAllItems } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

// GET /api/admin/items  — protected, lists every item for the admin panel.
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getAllItems();
  return NextResponse.json({ items });
}
