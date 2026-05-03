"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ---------------- GET CASH FLOW ----------------
// ---------------- GET CASH FLOW ----------------
// ✅ Optimized getCashFlow (fewer DB queries)
export async function getCashFlow(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth   = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // ✅ One query to fetch all transactions of this account
    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        accountId,
        date: { lte: endOfMonth }, // fetch all up to today
      },
      select: { type: true, amount: true, date: true },
    });

    // --- Split logic ---
    let income = 0;
    let expense = 0;
    let invested = 0;

    for (const tx of transactions) {
      const amt = tx.amount.toNumber();

      // All-time invested = sum of deposits - withdrawals
      if (tx.type === "DEPOSIT") {
        invested += amt;
        if (tx.date >= startOfMonth) income += amt; // this month income
      } else if (tx.type === "WITHDRAW") {
        invested -= amt;
        if (tx.date >= startOfMonth) expense += amt; // this month expense
      }
    }

    const net = income - expense;

    return { income, expense, invested, net };
  } catch (error) {
    console.error("Error fetching cash flow:", error);
    throw error;
  }
}




// ---------------- UPDATE CASH FLOW ----------------
// ---------------- UPDATE CASH FLOW ----------------
export async function updateCashFlow(accountId, amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Ensure the account exists and belongs to the user
    const account = await db.account.findFirst({
      where: { id: accountId, userId: user.id },
      select: { id: true, balance: true },
    });
    if (!account) throw new Error("Account not found");

    // Create a transaction linked to this account
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        accountId,
        amount,
        type: amount >= 0 ? "DEPOSIT" : "WITHDRAW",
        date: new Date(),
      },
    });

    // Update only this account's balance
    await db.account.update({
      where: { id: accountId },
      data: { balance: account.balance + amount },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        ...transaction,
        amount: transaction.amount ? transaction.amount.toNumber() : 0,
      },
    };
  } catch (error) {
    console.error("Error updating cash flow:", error);
    return { success: false, error: error.message };
  }
}
