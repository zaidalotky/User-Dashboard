// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const users = [
    "alice", "bob", "carol", "dave", "eve",
    "frank", "grace", "heidi", "ivan", "judy",
  ];

  return NextResponse.json(users);
}
