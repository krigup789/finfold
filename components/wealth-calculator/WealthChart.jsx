"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WealthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#c7d2fe" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
