"use client";
import React, { useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

function SummaryCard({ label, value, highlight }) {
  return (
    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 text-sm">
      <span>{label}</span>
      <span
        className={`${
          highlight ? "text-green-600 dark:text-green-400 font-semibold" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function fmt(value) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return value.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function SWPCalculator() {
  // Inputs
  const [initial, setInitial] = useState(10000000);
  const [holdYears, setHoldYears] = useState(1);
  const [withdraw, setWithdraw] = useState(10000);
  const [duration, setDuration] = useState(10);
  const [ror, setRor] = useState(10);
  const [inflation, setInflation] = useState(10);
  const [taxRate, setTaxRate] = useState(10);

  // Results
  const [result, setResult] = useState(null);
  const [growthTable, setGrowthTable] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const calculate = () => {
    const rate = ror / 100;
    const infRate = inflation / 100;
    const tax = taxRate / 100;

    let balance = initial;
    let totalWithdraw = 0;
    let swpTaxes = 0;
    let withdrawAmount = withdraw;
    let firstSWP = withdraw;
    let lastSWP = 0;

    const startYear = new Date().getFullYear();
    const table = [];

    for (let year = 1; year <= duration; year++) {
      const currentYear = startYear + year - 1;
      let yearOpening = balance;
      let yearWithdraw = 0;
      let yearGrowth = 0;

      // SWP shown for this year
      const displayedSwpForYear = year > holdYears ? withdrawAmount : 0;

      for (let m = 0; m < 12; m++) {
        // growth first
        const monthlyGrowth = balance * (rate / 12);
        balance += monthlyGrowth;
        yearGrowth += monthlyGrowth;

        // then withdrawal (if past holding years)
        if (year > holdYears) {
          balance -= withdrawAmount;
          yearWithdraw += withdrawAmount;
          totalWithdraw += withdrawAmount;
        }
      }

      // tax for this year (based on withdrawn)
      const taxForYear = yearWithdraw * tax;
      swpTaxes += taxForYear;

      // add row to table
      table.push({
        year: currentYear,
        opening: Number(yearOpening.toFixed(2)),
        growth: Number(yearGrowth.toFixed(2)),
        Withdrawal: Number(yearWithdraw.toFixed(2)),
        SWPInflation: Number(displayedSwpForYear.toFixed(2)),
        TAX: Number(taxForYear.toFixed(2)),
        closing: Number(balance.toFixed(2)),
      });

      // update last SWP at end of this year
      if (year > holdYears) {
        lastSWP = withdrawAmount;
        withdrawAmount *= 1 + infRate; // inflate for next year
      }
    }

    // final redemption tax (after duration)
    const capitalGain = balance - initial;
    const taxableGain = Math.max(capitalGain - 100000, 0);
    const redemptionTax = taxableGain * tax;
    const finalCorpus = balance - redemptionTax;

    const profit = Number((finalCorpus + totalWithdraw - initial).toFixed(2));
    const closingBalance = Number(balance.toFixed(2));

    setResult({
      investment: initial,
      duration,
      profit,
      totalWithdrawal: Number(totalWithdraw.toFixed(2)),
      closingBalance,
      finalTax: Number((redemptionTax + swpTaxes).toFixed(2)),
      taxSWP: Number(swpTaxes.toFixed(2)),
      taxRedemption: Number(redemptionTax.toFixed(2)),
      firstSWP: Number(firstSWP.toFixed(2)),
      lastSWP: Number(lastSWP.toFixed(2)), // ✅ fixed
      corpusEndYear: startYear + duration,
    });

    setGrowthTable(table);
    setShowResult(true);
  };

  // Chart Data
  const lineData = {
    labels: growthTable.map((r) => r.year),
    datasets: [
      {
        label: "Total Withdrawn",
        data: growthTable.map((r) => r.Withdrawal),
        borderColor: "#4B0082",
        backgroundColor: "rgba(75, 0, 130, 0.3)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Closing Balance",
        data: growthTable.map((r) => r.closing),
        borderColor: "#228B22",
        backgroundColor: "rgba(34, 139, 34, 0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const labelColor = isDark ? "#E5E5E5" : "#222";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top", labels: { color: labelColor } },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ₹${fmt(ctx.parsed.y || 0)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Year", color: labelColor },
        ticks: { color: labelColor },
        grid: { color: gridColor },
      },
      y: {
        title: { display: true, text: "Amount (₹)", color: labelColor },
        ticks: { color: labelColor },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <h2 className="text-5xl font-semibold mb-6">SWP Calculator</h2>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
        className="space-y-6"
      >
        {[
          ["Initial Investment (₹)", initial, setInitial],
          ["Hold Before SWP (Years)", holdYears, setHoldYears],
          ["SWP Amount (₹)", withdraw, setWithdraw],
          ["Duration (Years)", duration, setDuration],
          ["Rate of Return (%)", ror, setRor],
          ["Inflation Rate (%)", inflation, setInflation],
          ["Tax Rate (%)", taxRate, setTaxRate],
        ].map(([label, value, setter], idx) => (
          <div key={idx}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type="number"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
            />
          </div>
        ))}

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
          Calculate Now
        </button>
      </form>

      {/* Results */}
      {showResult && result && (
        <>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Summary */}
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 text-sm">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <SummaryCard
                label="Initial Investment"
                value={`₹${fmt(result.investment)}`}
              />
              <SummaryCard
                label="First SWP"
                value={`₹${fmt(result.firstSWP)}`}
              />
              <SummaryCard
                label={`Last SWP (infl. ${inflation} %)`} 
                value={`₹${fmt(result.lastSWP)}`}
              />
              <SummaryCard label="Duration" value={`${result.duration} Yrs.`} />
              <SummaryCard label="Rate of Return" value={`${ror}%`} />
              <SummaryCard
                label="Total Withdrawal"
                value={`₹${fmt(result.totalWithdrawal)}`}
              />
              <SummaryCard
                label="Profit"
                value={`₹${fmt(result.profit)}`}
                highlight
              />
              <SummaryCard
                label="Corpus Should Last For"
                value={`${result.duration} Years (${result.corpusEndYear})`}
              />
              <SummaryCard
                label="Cl. Balance"
                value={`₹${fmt(result.closingBalance)}`}
              />
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Taxes on Capital Gains</h4>
                <SummaryCard
                  label="Taxes During SWP"
                  value={`₹${fmt(result.taxSWP)}`}
                />
                <SummaryCard
                  label="Tax on Final Redemption"
                  value={`₹${fmt(result.taxRedemption)}`}
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Investment vs Profit
              </h3>
              <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]">
                <Pie
                  data={{
                    labels: ["Investment Value", "Profit"],
                    datasets: [
                      {
                        data: [result.investment, result.profit],
                        backgroundColor: ["#4B0082", "#228B22"],
                        hoverBackgroundColor: ["#3A006B", "#1E7A1E"],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false, // makes chart responsive
                    plugins: {
                      legend: { 
                        labels: { color: labelColor, font: { size: 12 } }, 
                        position: "bottom" // better on mobile
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>


          {/* Growth Table */}
          <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow-sm overflow-auto">
            <h3 className="text-lg font-semibold px-4 pt-4">Growth Table</h3>
            <table className="min-w-full text-sm text-left mt-2">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {[
                    "Year",
                    "Opening Balance",
                    "Growth",
                    "Withdrawal",
                    "SWP (inflated)",
                    "TAX",
                    "Closing Balance",
                  ].map((head, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-right first:text-left"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {growthTable.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{row.year}</td>
                    <td className="px-4 py-2 text-right">
                      ₹{fmt(row.opening)}
                    </td>
                    <td className="px-4 py-2 text-right">{fmt(row.growth)}</td>
                    <td className="px-4 py-2 text-right">
                      ₹{fmt(row.Withdrawal)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ₹{fmt(row.SWPInflation)}
                    </td>
                    <td className="px-4 py-2 text-right">₹{fmt(row.TAX)}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ₹{fmt(row.closing)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Line Chart */}
          <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow-sm p-4 h-[400px]">
            <h3 className="text-lg font-semibold mb-4">Withdraw vs Growth</h3>
            <Line data={lineData} options={lineOpts} />
          </div>
        </>
      )}
    </div>
  );
}
