"use client";

import React, { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateCashFlow } from "@/actions/cashflow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

export function CashFlowCard({ income, expense, invested, net }) {
  const { data: updatedCashFlow, error } = useFetch(updateCashFlow);

  useEffect(() => {
    if (updatedCashFlow?.success) {
      toast.success("CashFlow updated successfully");
    }
  }, [updatedCashFlow]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update CashFlow");
    }
  }, [error]);

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Cash Flow
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ul className="mt-4 space-y-4 sm:space-y-6 text-foreground text-sm sm:text-base">
          <li className="flex justify-between items-center">
            <span className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">
              Incoming
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-600">
              {income != null ? formatINR(income) : "No Income"}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">
              Outgoing
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-red-500">
              {expense != null ? formatINR(expense) : "No Expense"}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">
              Invested
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600">
              {invested != null ? formatINR(invested) : "No Investment"}
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-3">
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Net Cash Flow :
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold flex items-center gap-1">
          {net != null ? formatINR(net) : "N/A"}
        </div>
      </CardFooter>
    </Card>
  );
}
