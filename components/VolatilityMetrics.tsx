"use client";

import { VolatilityMetrics as VolatilityMetricsType } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Image from "next/image";

interface VolatilityMetricsProps {
  volatility?: VolatilityMetricsType;
}

export default function VolatilityMetrics({ volatility }: VolatilityMetricsProps) {
  if (!volatility) return null;

  const chartData = [
    {
      name: "30 Days",
      Bitcoin: volatility.btc30dVolatility,
      Gold: volatility.gold30dVolatility,
    },
    {
      name: "90 Days",
      Bitcoin: volatility.btc90dVolatility,
      Gold: volatility.gold90dVolatility,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3">
          <p className="text-gray-200 text-sm mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-bold">
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const volatilityRatio30d = volatility.btc30dVolatility / volatility.gold30dVolatility;
  const volatilityRatio90d = volatility.btc90dVolatility / volatility.gold90dVolatility;

  return (
    <div className="bg-gradient-to-br from-violet-950/30 to-fuchsia-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-violet-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        📉 Volatility Analysis
      </h3>

      <div className="mb-4 bg-black/30 rounded-xl p-3 border border-white/10">
        <p className="text-sm text-gray-300 text-center">
          Annualized volatility (standard deviation of returns)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" tickFormatter={(value) => `${value}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Bitcoin" fill="#FF9500" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Gold" fill="#FFC107" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/bitcoin.png" alt="BTC" width={16} height={16} />
            <p className="text-gray-300 text-xs">BTC 30d</p>
          </div>
          <p className="text-lg font-bold text-orange-400">
            {volatility.btc30dVolatility.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/gold-bars.png" alt="Gold" width={16} height={16} />
            <p className="text-gray-300 text-xs">Gold 30d</p>
          </div>
          <p className="text-lg font-bold text-yellow-400">
            {volatility.gold30dVolatility.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/bitcoin.png" alt="BTC" width={16} height={16} />
            <p className="text-gray-300 text-xs">BTC 90d</p>
          </div>
          <p className="text-lg font-bold text-orange-400">
            {volatility.btc90dVolatility.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Image src="/gold-bars.png" alt="Gold" width={16} height={16} />
            <p className="text-gray-300 text-xs">Gold 90d</p>
          </div>
          <p className="text-lg font-bold text-yellow-400">
            {volatility.gold90dVolatility.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 rounded-xl p-3 border border-violet-600/20">
          <p className="text-xs text-gray-300 mb-1">Volatility Ratio (30d)</p>
          <p className="text-lg font-bold text-violet-400">
            {volatilityRatio30d.toFixed(1)}x
          </p>
          <p className="text-xs text-gray-400 mt-1">BTC is {volatilityRatio30d.toFixed(1)}x more volatile</p>
        </div>

        <div className="bg-gradient-to-r from-fuchsia-900/30 to-pink-900/30 rounded-xl p-3 border border-fuchsia-600/20">
          <p className="text-xs text-gray-300 mb-1">Volatility Ratio (90d)</p>
          <p className="text-lg font-bold text-fuchsia-400">
            {volatilityRatio90d.toFixed(1)}x
          </p>
          <p className="text-xs text-gray-400 mt-1">BTC is {volatilityRatio90d.toFixed(1)}x more volatile</p>
        </div>
      </div>
    </div>
  );
}
