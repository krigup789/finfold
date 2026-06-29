import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json(
        { message: "No Clerk user found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ API /check-user error:", error);
    return NextResponse.json(
      { error: "Failed to check or create user" },
      { status: 500 }
    );
  }
}
