"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    const { userId } = await auth();
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { accountId } = req.body;
    if (!accountId) return res.status(400).json({ success: false, message: "Account ID is required" });

    // Find user
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Find account and ensure it belongs to the user
    const account = await db.account.findUnique({ where: { id: accountId } });
    if (!account || account.userId !== user.id) {
      return res.status(404).json({ success: false, message: "Account not found or unauthorized" });
    }

    // If already default, do nothing
    if (account.isDefault) {
      return res.status(200).json({ success: true, message: "Already default account" });
    }

    // Unset previous default account
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default account
    await db.account.update({
      where: { id: accountId },
      data: { isDefault: true },
    });

    return res.status(200).json({ success: true, message: "Default account updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message || "Something went wrong" });
  }
}
