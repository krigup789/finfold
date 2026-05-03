// app/dashboard/_components/dashboard-client.jsx
"use client";

import { useState } from "react";
import { AccountsGrid } from "./accounts-grid";

export default function DashboardClient({ initialAccounts }) {
  const [accounts, setAccounts] = useState(initialAccounts || []);

  const handleAddAccount = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleDeleteAccount = (deletedId) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== deletedId));
  };

  return (
    <AccountsGrid
      accounts={accounts}
      onAddAccount={handleAddAccount}
      onDeleteAccount={handleDeleteAccount}
    />
  );
}
