import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("❌ No Clerk user found in checkUser()");
    return null;
  }

  try {
    // Try to find user in DB
    let loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      console.log("✅ Existing DB user:", loggedInUser.id);
      return loggedInUser;
    }

    // If not found → create new one
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      null; // use null instead of "" since email is optional in schema

    console.log("🟠 Creating new DB user:", user.id);

    loggedInUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || user.username || "New User",
        imageUrl: user.imageUrl,
        email,
      },
    });

    console.log("✅ New DB user created:", loggedInUser.id);

    return loggedInUser;
  } catch (error) {
    console.error("❌ checkUser error:", error);
    throw new Error("Failed to check or create user");
  }
};
