"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";

const DATE_RANGES = {
  "1M": { label: "Last Month", months: 1 },
  "3M": { label: "Last 3 Months", months: 3 },
  "6M": { label: "Last 6 Months", months: 6 },
  "1Y": { label: "Last 1 Year", months: 12 },
  ALL: { label: "All Time", months: null },
};

// ✅ Currency formatter for INR
const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function ChartAreaDefault({ accounts }) {
  const [dateRange, setDateRange] = useState("6M");

  const chartData = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    const events = [];

    // 1️⃣ Build all events (accounts + transactions)
    accounts.forEach((acc) => {
      const createdAt = new Date(acc.createdAt);

      const totalTx = (acc.transactions || []).reduce((sum, tx) => {
        return (
          sum + (tx.type === "DEPOSIT" ? Number(tx.amount) : -Number(tx.amount))
        );
      }, 0);

      const openingBalance =
        acc.openingBalance !== undefined
          ? Number(acc.openingBalance)
          : Number(acc.balance || 0) - totalTx;

      // ✅ Correct opening event
      events.push({
        date: createdAt,
        accountId: acc.id,
        amount: openingBalance,
      });

      // ✅ Transactions
      (acc.transactions || []).forEach((tx) => {
        events.push({
          date: new Date(tx.date),
          accountId: acc.id,
          amount:
            tx.type === "DEPOSIT" ? Number(tx.amount) : -Number(tx.amount),
        });
      });
    });

    // 2️⃣ Sort events (timeline)
    events.sort((a, b) => a.date - b.date);

    const range = DATE_RANGES[dateRange];
    const now = new Date();

    const rangeStart = range.months
      ? subMonths(now, range.months)
      : (events[0]?.date ?? now);

    const balances = new Map();
    const data = [];
    let lastDateKey = null;

    // 3️⃣ STEP 1: Apply ALL events before range (build initial state)
    events.forEach(({ date, accountId, amount }) => {
      if (date >= rangeStart) return;

      const prev = balances.get(accountId) ?? 0;
      balances.set(accountId, prev + amount);
    });

    // 4️⃣ Calculate initial net worth
    let totalNetWorth = Array.from(balances.values()).reduce(
      (sum, v) => sum + v,
      0
    );

    // 5️⃣ Push starting point (IMPORTANT)
    data.push({
      date: format(rangeStart, "yyyy-MM-dd"),
      balance: Math.max(totalNetWorth, 0),
    });

    lastDateKey = format(rangeStart, "yyyy-MM-dd");

    // 6️⃣ STEP 2: Apply events inside range (main graph logic)
    events.forEach(({ date, accountId, amount }) => {
      if (date < rangeStart) return;

      const prev = balances.get(accountId) ?? 0;
      balances.set(accountId, prev + amount);

      totalNetWorth = Array.from(balances.values()).reduce(
        (sum, v) => sum + v,
        0
      );

      const dateKey = format(date, "yyyy-MM-dd");

      if (dateKey !== lastDateKey) {
        data.push({
          date: dateKey,
          balance: Math.max(totalNetWorth, 0),
        });
        lastDateKey = dateKey;
      } else {
        data[data.length - 1].balance = Math.max(totalNetWorth, 0);
      }
    });

    // 7️⃣ Ensure at least 2 points (for flat graph case)
    if (data.length === 1) {
      data.push({
        date: format(now, "yyyy-MM-dd"),
        balance: totalNetWorth,
      });
    }

    return data;
  }, [accounts, dateRange]);

  // ✅ Get the latest date from chartData safely
  // const latestDate = chartData.length > 0 ? new Date(chartData[chartData.length - 1].date) : null;

  // ✅ Calculate total net worth across all accounts
  const totalNetWorth = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  // ✅ Calculate net worth trend based purely on chartData (not accounts)
  const latestNetWorth =
    chartData.length > 0 ? chartData[chartData.length - 1].balance : 0;

  const firstNetWorth =
    chartData.length > 0 ? chartData[0].balance : latestNetWorth;

  const isTrendingUp = latestNetWorth > firstNetWorth;

  const percentageChange =
    firstNetWorth > 0
      ? ((latestNetWorth - firstNetWorth) / firstNetWorth) * 100
      : 0;

  // ✅ Handle empty state
  if (!accounts || accounts.length === 0) {
    return (
      <Card className="hover:shadow-md transition-shadow bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>No accounts found</CardTitle>
          <CardDescription>
            Net worth chart cannot be displayed.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // ✅ UI section
  return (
    <Card className="hover:shadow-md transition-shadow bg-card text-card-foreground">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-6 pb-5">
        {/* Left side */}
        <div className="flex flex-col">
          <CardTitle className="text-3xl sm:text-4xl font-semibold">
            Net Worth
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Showing full historical trend
          </CardDescription>
        </div>

        {/* Right side */}
        <div className="flex flex-col sm:items-end gap-3">
          {/* Net worth value */}
          <div className="text-3xl sm:text-5xl font-semibold text-foreground">
            {formatINR(totalNetWorth)}
          </div>

          {/* Trend Indicator */}
          <div
            className={`text-sm font-medium flex items-center gap-1 ${
              isTrendingUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {isTrendingUp ? "▲" : "▼"} {percentageChange.toFixed(1)}%
            <span className="text-muted-foreground ml-1">
              since {DATE_RANGES[dateRange].label.toLowerCase()}
            </span>
          </div>

          {/* Date Range Selector */}
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              className="w-full sm:w-[160px] border border-border bg-background text-foreground
                        placeholder:text-muted-foreground focus:ring-2 
                        focus:ring-ring rounded-md px-3 py-2"
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
        </div>
      </CardHeader>

      {/* Chart Section */}
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tick={{ fill: "hsl(var(--foreground))" }}
              tickFormatter={(value) => format(new Date(value), "dd MMM")}
            />
            <Tooltip
              formatter={(value) => [formatINR(value), "Net Worth"]}
              labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                padding: "8px 12px",
                fontSize: "12px",
              }}
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="#22c55e"
              stroke="#16a34a"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium">
              {isTrendingUp ? "Trending up" : "Trending down"}
              <TrendingUp
                className={`h-4 w-4 ${
                  isTrendingUp ? "text-green-600" : "text-red-600 rotate-180"
                }`}
              />
            </div>
            <div className="text-muted-foreground">
              {chartData[0]?.month
                ? format(new Date(`${chartData[0].month}-01`), "MMM yyyy")
                : ""}
              {" – "}
              {chartData[chartData.length - 1]?.month
                ? format(
                    new Date(`${chartData[chartData.length - 1].month}-01`),
                    "MMM yyyy"
                  )
                : ""}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
