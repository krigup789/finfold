"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper to convert Decimal and Date safely
const serialize = (obj) => ({
  ...obj,
  balance: obj.balance?.toNumber?.() ?? 0,
  amount: obj.amount?.toNumber?.() ?? undefined,
  date: obj.date?.toISOString?.() ?? obj.date,
  createdAt: obj.createdAt?.toISOString?.() ?? obj.createdAt,
});

export async function getAccountsWithTransactions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    include: {
      transactions: {
        orderBy: { date: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return accounts.map((acc) => ({
    id: acc.id,
    name: acc.name,
    createdAt: acc.createdAt.toISOString(),
    balance: acc.balance.toNumber(),
    transactions: acc.transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      amount: txn.amount.toNumber(),
      date: txn.date.toISOString(),
    })),
  }));
}
