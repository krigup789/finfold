"use client"; // Required in Next.js app directory

import React, { useState } from "react";
import { useTheme } from "next-themes"; // For dark mode support

// Import chart.js modules
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
import { Pie, Line } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// Reusable UI component
function SummaryCard({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between py-1 border-b text-sm">
      <span>{label}</span>
      <span className={highlight ? "text-green-600 font-semibold" : ""}>
        {value}
      </span>
    </div>
  );
}

// ✅ Currency formatter for INR
const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function WealthCalculator() {
  // Basic Inputs
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [frequency, setFrequency] = useState("12");
  const [durationYears, setDurationYears] = useState(10);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);

  // Advanced Options
  const [stepUpRatePercent, setStepUpRatePercent] = useState(10);
  const [inflationRatePercent, setInflationRatePercent] = useState(6);
  const [stopAfterYears, setStopAfterYears] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Output
  const [showResult, setShowResult] = useState(false);
  const [growthTable, setGrowthTable] = useState([]);
  const [result, setResult] = useState({
    investment: 0,
    duration: 10,
    rog: 12,
    growth: 0,
    returnAmount: 0,
  });

  //opening balance
  const startingopeningBalance = initialInvestment;

  // Main Calculation
  const calculate = () => {
    const inflationRate = inflationRatePercent;
    const monthlyRate = (annualReturnRate - inflationRate) / 100 / 12;
    const interestRate = (annualReturnRate - inflationRate) / 100;
    const stepUpRate = stepUpRatePercent / 100;
    const curryear = new Date().getFullYear();

    let totalInvestment = initialInvestment;
    let yearlyDetails = [];
    let prevYearClosing = 0;
    let fullyearInvestment = initialInvestment;
    let totalSIP_FV_After_Sip_Stopped = 0;
    let FV_totalSIP_FV_After_Sip_Stopped_Year = 0;

    for (let year = 0; year < durationYears; year++) {
      const openingBalance =
        curryear + year === 2025 ? startingopeningBalance : prevYearClosing;
      const isContributing = stopAfterYears === 0 || year < stopAfterYears;
      const sipAmount = isContributing
        ? monthlySIP * Math.pow(1 + stepUpRate, year)
        : 0;
      const monthsLeft = (year + 1) * 12;
      const FV_sip =
        sipAmount *
        ((Math.pow(1 + monthlyRate, monthsLeft) - 1) / monthlyRate) *
        (1 + monthlyRate);

      //totalSIP_FV after sip stopped.
      isContributing ? (totalSIP_FV_After_Sip_Stopped = FV_sip) : 0;

      // 📈 Lump sum future value till this year
      const FV_lumpYear =
        initialInvestment * Math.pow(1 + interestRate, year + 1);

      isContributing
        ? 0
        : (FV_totalSIP_FV_After_Sip_Stopped_Year =
            totalSIP_FV_After_Sip_Stopped *
            Math.pow(1 + interestRate, year + 1 - stopAfterYears));

      totalInvestment += sipAmount * 12;
      fullyearInvestment += sipAmount * 12;
      prevYearClosing =
        FV_sip + FV_lumpYear + FV_totalSIP_FV_After_Sip_Stopped_Year;
      //const growthbyyear = initialInvestment === 0 ? totalSIP_FV - fullyearInvestment : fullyearInvestment - totalSIP_FV;
      //lastYearinvestment = fullyearInvestment;
      yearlyDetails.push({
        year: curryear + year,
        opening: Math.round(openingBalance),
        periodicInvestment: `${formatINR(Math.round(sipAmount))} x 12`,
        selfInvestment: Math.round(fullyearInvestment),
        growth: Math.round(
          FV_sip +
            FV_lumpYear +
            FV_totalSIP_FV_After_Sip_Stopped_Year -
            fullyearInvestment
        ),
        closing: Math.round(
          FV_sip + FV_lumpYear + FV_totalSIP_FV_After_Sip_Stopped_Year
        ),
      });
      //prevFV_lumpYear = initialInvestment + totalSIP_FV_After_Sip_Stopped;
    }

    // const adjustedFV = totalFV / Math.pow(1 + inflationRate, durationYears);

    setResult({
      investment: Math.round(totalInvestment),
      duration: durationYears,
      rog: annualReturnRate,
      growth: Math.round(prevYearClosing - totalInvestment + 1),
      returnAmount: Math.round(prevYearClosing),
    });

    setGrowthTable(yearlyDetails);
    setShowResult(true);
  };

  const lineChartData = {
    labels: growthTable.map((row) => row.year),
    datasets: [
      {
        label: "Invested",
        data: growthTable.map((row) => row.selfInvestment),
        borderColor: "#4B0082", // Line color
        backgroundColor: "rgba(75, 0, 130, 0.3)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Growth",
        data: growthTable.map((row) => row.closing),
        borderColor: "green",
        backgroundColor: "rgba(34, 139, 34, 0.3)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const { theme } = useTheme(); // "light" | "dark" | "system"
  const isDark = theme === "dark";

  const labelColor = isDark ? "#E5E5E5" : "#222";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: labelColor },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${formatINR(value)}`;
          },
        },
      },
    },
    interaction: { mode: "nearest", intersect: false },
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
      <h2 className="text-4xl font-semibold mb-6">Future Wealth Calculator</h2>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
        className="space-y-6"
      >
        {/* Initial Capital */}
        <div>
          <label className="block font-medium mb-1">Initial Capital (₹)</label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
          />
        </div>

        {/* Periodic Contribution */}
        <div>
          <label className="block font-medium mb-1">
            Periodic Contribution (₹)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={monthlySIP}
              onChange={(e) => setMonthlySIP(Number(e.target.value))}
              className="w-1/2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-1/2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
            >
              <option value="12">Monthly</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium mb-1">Duration (Years)</label>
          <input
            type="number"
            value={durationYears}
            onChange={(e) => setDurationYears(Number(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
          />
        </div>

        {/* Expected Rate of Growth */}
        <div>
          <label className="block font-medium mb-1">
            Expected Rate of Growth (%)
          </label>
          <input
            type="number"
            value={annualReturnRate}
            onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
          />
        </div>

        {/* Advanced Options */}
        <div>
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
            />
            Advanced Options
          </label>

          {showAdvanced && (
            <div className="mt-4 space-y-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded">
              <div>
                <label className="block font-medium mb-1">
                  Yearly Increase/Decrease Contribution (%)
                </label>
                <input
                  type="number"
                  value={stepUpRatePercent}
                  onChange={(e) => setStepUpRatePercent(Number(e.target.value))}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Rate of Inflation (%)
                </label>
                <input
                  type="number"
                  value={inflationRatePercent}
                  onChange={(e) =>
                    setInflationRatePercent(Number(e.target.value))
                  }
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Stop Contribution After (Years)
                </label>
                <input
                  type="number"
                  value={stopAfterYears}
                  onChange={(e) => setStopAfterYears(Number(e.target.value))}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Calculate Now
        </button>
      </form>

      {/* Result Section */}
      {showResult && (
        <>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 text-sm">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <SummaryCard
                label="Investment"
                value={`${formatINR(result.investment)}`}
              />
              <SummaryCard label="Duration" value={`${result.duration} Yrs.`} />
              <SummaryCard label="ROG" value={`${result.rog}%`} />
              <SummaryCard
                label="Growth"
                value={`${formatINR(result.growth)}`}
              />
              <SummaryCard
                label="Return*"
                value={`${formatINR(result.returnAmount)}`}
                highlight
              />
            </div>

            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Investment vs Growth
              </h3>
              <Pie
                data={{
                  labels: ["Investment", "Growth"],
                  datasets: [
                    {
                      data: [result.investment, result.growth],
                      backgroundColor: ["#4B0082", "#228B22"],
                      hoverBackgroundColor: ["#3A006B", "#1E7A1E"],
                      hoverOffset: 4,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: labelColor, // ✅ legend adapts to theme
                      },
                    },
                    // tooltip: {
                    //   titleColor: labelColor, // ✅ tooltip title adapts
                    //   bodyColor: labelColor,  // ✅ tooltip text adapts
                    // },
                  },
                }}
              />
            </div>
          </div>

          {/* Growth Table */}
          <div className="mt-8 border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-auto">
            <h3 className="text-lg font-semibold px-4 pt-4">Growth Table</h3>
            <table className="min-w-full text-sm text-left mt-2">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Year</th>
                  <th className="px-4 py-2 text-right">Opening</th>
                  <th className="px-4 py-2 text-right">Periodic Investment</th>
                  <th className="px-4 py-2 text-right">Self Investment</th>
                  <th className="px-4 py-2 text-right">Growth</th>
                  <th className="px-4 py-2 text-right">Closing</th>
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
                      {formatINR(row.opening)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {row.periodicInvestment}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatINR(row.selfInvestment)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatINR(row.growth)}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      {formatINR(row.closing)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Line Chart */}
          <div className="mt-8 border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 h-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Invested vs Wealth Growth
            </h3>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </>
      )}
    </div>
  );
}
