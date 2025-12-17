"use client";

import { PerformanceComparison } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import Image from "next/image";

interface PerformanceChartProps {
  performance?: PerformanceComparison;
}

export default function PerformanceChart({ performance }: PerformanceChartProps) {
  if (!performance) return null;

  const chartData = [
    {
      name: "YTD",
      Bitcoin: performance.ytd.btcReturn,
      Gold: performance.ytd.goldReturn,
    },
    {
      name: "1 Year",
      Bitcoin: performance.oneYear.btcReturn,
      Gold: performance.oneYear.goldReturn,
    },
  ];

  if (performance.fiveYear) {
    chartData.push({
      name: "5 Years",
      Bitcoin: performance.fiveYear.btcReturn,
      Gold: performance.fiveYear.goldReturn,
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3">
          <p className="text-gray-200 text-sm mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-bold">
              {entry.name}: {entry.value >= 0 ? "+" : ""}{entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-green-950/30 to-emerald-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-green-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        📈 Performance Comparison
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" tickFormatter={(value) => `${value}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Bitcoin" fill="#FF9500" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-btc-${index}`}
                fill={entry.Bitcoin >= 0 ? "#10B981" : "#EF4444"}
              />
            ))}
          </Bar>
          <Bar dataKey="Gold" fill="#FFC107" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-gold-${index}`}
                fill={entry.Gold >= 0 ? "#34D399" : "#F87171"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/bitcoin.png" alt="BTC" width={16} height={16} />
            <p className="text-gray-300 text-xs">BTC YTD</p>
          </div>
          <p className={`text-lg font-bold ${performance.ytd.btcReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
            {performance.ytd.btcReturn >= 0 ? "+" : ""}{performance.ytd.btcReturn.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/gold-bars.png" alt="Gold" width={16} height={16} />
            <p className="text-gray-300 text-xs">Gold YTD</p>
          </div>
          <p className={`text-lg font-bold ${performance.ytd.goldReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
            {performance.ytd.goldReturn >= 0 ? "+" : ""}{performance.ytd.goldReturn.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/bitcoin.png" alt="BTC" width={16} height={16} />
            <p className="text-gray-300 text-xs">BTC 1Y</p>
          </div>
          <p className={`text-lg font-bold ${performance.oneYear.btcReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
            {performance.oneYear.btcReturn >= 0 ? "+" : ""}{performance.oneYear.btcReturn.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/gold-bars.png" alt="Gold" width={16} height={16} />
            <p className="text-gray-300 text-xs">Gold 1Y</p>
          </div>
          <p className={`text-lg font-bold ${performance.oneYear.goldReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
            {performance.oneYear.goldReturn >= 0 ? "+" : ""}{performance.oneYear.goldReturn.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
