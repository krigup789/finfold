import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser"; // your custom logic

export async function GET() {
  const user = await checkUser();
  return NextResponse.json(user);
}
