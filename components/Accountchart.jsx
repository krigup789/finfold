"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last 1 Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= endOfDay(now);
    });

    const grouped = filtered.reduce((acc, transaction) => {
      const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = {
          dateKey,
          dateLabel: format(new Date(transaction.date), "MMM dd"),
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "DEPOSIT") {
        acc[dateKey].income += transaction.amount;
      } else if (transaction.type === "WITHDRAW") {
        acc[dateKey].expense += transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.dateKey) - new Date(b.dateKey)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

    // ✅ Currency formatter for INR
  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 mb-6 text-sm w-full">
          <div className="flex flex-col">
            <p className="text-muted-foreground">T</p>
            <p className="text-lg font-bold text-green-500 break-words">
              ₹{formatINR(totals.income)}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground">Total Withdraw</p>
            <p className="text-lg font-bold text-red-500 break-words">
              ₹{formatINR(totals.expense)}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold break-words ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{formatINR((totals.income - totals.expense).toFixed(2))}
            </p>
          </div>
        </div>


        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value, name) => [
                  `₹${value}`,
                  name === "income" ? "Deposit" : "Withdraw",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                fill="green"
                fillOpacity={0.2}
                name="Deposit"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fill="red"
                fillOpacity={0.2}
                name="Withdraw"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
