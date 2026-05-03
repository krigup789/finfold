"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
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

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const dateKey = format(new Date(transaction.date), "yyyy-MM-dd"); // for sorting
      if (!acc[dateKey]) {
        acc[dateKey] = {
          dateKey,
          dateLabel: format(new Date(transaction.date), "MMM dd"), // for display
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              className="w-[140px] border border-border bg-background text-foreground 
                        placeholder:text-muted-foreground rounded-md px-3 py-2 
                        focus:ring-2 focus:ring-ring"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>

            <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-md">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 mb-6 text-sm md:flex-row md:justify-around">
          {/* Total Deposit */}
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">Total Deposit</p>
            <p className="text-lg font-bold text-green-500">
              ₹{totals.income.toFixed(2)}
            </p>
          </div>

          {/* Total Withdraw */}
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">Total Withdraw</p>
            <p className="text-lg font-bold text-red-500">
              ₹{totals.expense.toFixed(2)}
            </p>
          </div>

          {/* Net */}
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>


        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
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
                formatter={(value) => [`₹${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Deposit"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                activeBar={false}
              />
              <Bar
                dataKey="expense"
                name="Withdraw"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Style a line chart or pie chart similarly?

// Add an animated chart loading effect?
