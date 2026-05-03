"use client";

import React, { createContext, useContext } from "react";
import { Tooltip } from "recharts";

// Context to pass down config (colors, labels, etc.)
const ChartContext = createContext({});

export const ChartContainer = ({ config, children }) => {
  return (
    <ChartContext.Provider value={config}>
      <div className="w-full h-[300px]">{children}</div>
    </ChartContext.Provider>
  );
};

export const ChartTooltip = ({ content, ...props }) => {
  return <Tooltip {...props} content={content} />;
};

export const ChartTooltipContent = ({
  active,
  payload,
  label,
}) => {
  const config = useContext(ChartContext);

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border bg-white p-3 shadow-md dark:bg-gray-950">
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      {payload.map((entry, i) => {
        const color = config?.[entry.dataKey]?.color || entry.color;
        const labelText = config?.[entry.dataKey]?.label || entry.dataKey;
        return (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{labelText}</span>
            <span className="ml-auto font-medium text-black dark:text-white">
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
