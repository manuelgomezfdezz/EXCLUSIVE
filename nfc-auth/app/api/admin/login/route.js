import { NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/auth";

// POST /api/admin/login  — validates the admin password.
// Returns 200 if correct so the client can store it for subsequent requests.
export async function POST(request) {
  const { password } = await request.json();

  if (password && password === getAdminPassword()) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
