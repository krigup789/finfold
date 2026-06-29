"use client";

import { ArrowUpRight, ArrowDownRight, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AccountCard({ account, onDelete, onDefaultChange }) {
  const { name, type, balance, id, isDefault } = account;

  const { loading: updateDefaultLoading, fn: updateDefaultFn } =
    useFetch(updateDefaultAccount);

  // ----------------------
  // Delete Account Handler
  // ----------------------
  const handleDelete = async () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: id }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Investment deleted successfully");
        onDelete?.(id); // notify parent to remove from state
      } else {
        toast.error(data.message || "Failed to delete investment");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // ----------------------
  // Currency formatter
  // ----------------------
  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Card className="min-h-[220px] sm:min-h-[200px] bg-card text-foreground hover:shadow-md transition-shadow group relative flex flex-col justify-between">
      {/* Clickable content */}
      <Link
        href={`/account/${id}`}
        className="flex flex-col flex-1 p-4 sm:p-2"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl sm:text-base font-bold capitalize">
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="text-2xl sm:text-xl font-bold">
            {formatINR(parseFloat(balance).toFixed(2))}
          </div>
          <p className="text-sm sm:text-xs text-muted-foreground capitalize">
            {type.toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between text-sm sm:text-xs text-muted-foreground mt-auto mb-0 pb-0">
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>

      {/* Controls (top-right corner) */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {/* Default switch */}
        <Switch
          checked={isDefault} // controlled by prop
          onCheckedChange={async () => {
            if (isDefault) {
              toast.warning("You need at least 1 default account");
              return;
            }

            // ✅ update parent state immediately
            onDefaultChange?.(id);

            // async backend update
            try {
              const result = await updateDefaultFn(id);
              if (result?.success) {
                toast.success("Default account updated successfully");
              }
            } catch (err) {
              toast.error(err.message || "Failed to update default account");
            }
          }}
          onClick={(e) => e.stopPropagation()} // prevent Link navigation
          disabled={updateDefaultLoading}
        />

        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="p-2"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
