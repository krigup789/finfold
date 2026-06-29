"use client";

import { useState } from "react";
import { AccountCard } from "./account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function AccountsGrid({ initialAccounts }) {
  const [accounts, setAccounts] = useState(initialAccounts);

  // Remove account after delete
  const removeAccount = (accountId) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
  };

  // Add new account after creation
  const addAccount = (newAccount) => {
    setAccounts((prev) => [newAccount, ...prev]); // add on top
  };

  // ✅ Handle default account change instantly
  const handleDefaultChange = (defaultId) => {
    setAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isDefault: acc.id === defaultId, // only new default becomes true
      }))
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 sm:px-2">
      {/* Add New Investment Card */}
      <CreateAccountDrawer onCreate={addAccount}>
        <Card className="w-full min-h-[200px] sm:min-h-[220px] border-dashed hover:shadow-md cursor-pointer bg-card text-muted-foreground transition-shadow">
          <CardContent className="flex flex-col items-center justify-center h-full pt-5 sm:pt-4 sm:px-2">
            <Plus className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium sm:text-xs">
              Add New Investment
            </p>
          </CardContent>
        </Card>
      </CreateAccountDrawer>

      {/* Account Cards */}
      {accounts.length > 0 &&
        accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onDelete={removeAccount}
            onDefaultChange={handleDefaultChange} // updates UI immediately
          />
        ))}
    </div>
  );
}
