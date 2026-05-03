"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function WealthLineChart({ years, investedData, growthData }) {
  const data = {
    labels: years,
    datasets: [
      {
        label: "Invested",
        data: investedData,
        borderColor: "#C49CA8",
        backgroundColor: "#C49CA8",
        fill: false,
      },
      {
        label: "Growth",
        data: growthData,
        borderColor: "#950C39",
        backgroundColor: "#950C39",
        fill: false,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Year" } },
      y: { title: { display: true, text: "Amount" } },
    },
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index", intersect: false },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
