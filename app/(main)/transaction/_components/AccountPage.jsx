"use client";

import { useState, useEffect } from "react";
import { AccountChart } from "./AccountChart";
import { AddTransactionForm } from "./AddTransactionForm";
import { fetchTransactions } from "@/actions/transaction"; // Your API fetch
import { fetchAccounts, fetchCategories } from "@/actions/account";

export default function AccountPage({ accountId }) {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Initial fetch
  useEffect(() => {
    fetchTransactions(accountId).then((data) => setTransactions(data));
    fetchAccounts().then(setAccounts);
    fetchCategories().then(setCategories);
  }, [accountId]);

  // Callback for newly added transaction
  const handleTransactionAdded = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <div className="space-y-8">
      {/* Transaction Chart */}
      <AccountChart transactions={transactions} />

      {/* Add Transaction Form */}
      <AddTransactionForm
        accounts={accounts}
        categories={categories}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}
