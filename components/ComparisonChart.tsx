"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { calculatePercentage } from "@/lib/utils";
import { COLORS } from "@/lib/constants";

interface ComparisonChartProps {
  bitcoinMarketCap: number;
  goldMarketCap: number;
}

export default function ComparisonChart({
  bitcoinMarketCap,
  goldMarketCap,
}: ComparisonChartProps) {
  const total = bitcoinMarketCap + goldMarketCap;

  const data = [
    {
      name: "Bitcoin",
      value: bitcoinMarketCap,
      percentage: calculatePercentage(bitcoinMarketCap, total),
      color: COLORS.bitcoin,
    },
    {
      name: "Gold",
      value: goldMarketCap,
      percentage: calculatePercentage(goldMarketCap, total),
      color: COLORS.gold,
    },
  ];

  const formatValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    return `$${value}`;
  };

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-xl border border-gray-800">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Market Cap Comparison
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#FFFFFF", fontSize: 14 }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
            formatter={(value: number) => formatValue(value)}
            labelStyle={{ color: "#A0A0A0" }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-2 px-4 bg-background rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="font-bold" style={{ color: item.color }}>
                {formatValue(item.value)}
              </p>
              <p className="text-sm text-textSecondary">{item.percentage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
