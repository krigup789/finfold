"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WealthPieChart({ investment, growth }) {
  const data = {
    labels: ["Investment", "Growth"],
    datasets: [
      {
        data: [investment, growth],
        backgroundColor: ["#C49CA8", "#950C39"],
      },
    ],
  };

  return (
    <div className="w-full max-w-md h-[300px]">
      <Pie data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
}
