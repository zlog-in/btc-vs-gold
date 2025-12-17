"use client";

import { HistoricalDataPoint } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface HistoricalChartProps {
  historicalData?: HistoricalDataPoint[];
}

export default function HistoricalChart({ historicalData }: HistoricalChartProps) {
  if (!historicalData || historicalData.length === 0) return null;

  // Normalize data to show percentage change from start
  const normalizedData = historicalData.map((point, index) => {
    const btcPctChange = index === 0 ? 0 : ((point.btcPrice - historicalData[0].btcPrice) / historicalData[0].btcPrice) * 100;
    const goldPctChange = index === 0 ? 0 : ((point.goldPrice - historicalData[0].goldPrice) / historicalData[0].goldPrice) * 100;

    return {
      date: point.date,
      btcChange: btcPctChange,
      goldChange: goldPctChange,
      btcPrice: point.btcPrice,
      goldPrice: point.goldPrice,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3">
          <p className="text-gray-200 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index}>
              <p style={{ color: entry.color }} className="text-sm font-bold">
                {entry.name}: {entry.value >= 0 ? "+" : ""}{entry.value.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-950/30 to-gray-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-slate-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        📊 Historical Performance (90 Days)
      </h3>

      <div className="mb-4 bg-black/30 rounded-xl p-3 border border-white/10">
        <p className="text-sm text-gray-300 text-center">
          Normalized to show percentage change from starting point
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={normalizedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            stroke="#ffffff"
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis stroke="#ffffff" tickFormatter={(value) => `${value}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="btcChange"
            name="Bitcoin"
            stroke="#FF9500"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="goldChange"
            name="Gold"
            stroke="#FFC107"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">Bitcoin Total Change</p>
          <p className={`text-xl font-bold ${normalizedData[normalizedData.length - 1].btcChange >= 0 ? "text-green-400" : "text-red-400"}`}>
            {normalizedData[normalizedData.length - 1].btcChange >= 0 ? "+" : ""}
            {normalizedData[normalizedData.length - 1].btcChange.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">Gold Total Change</p>
          <p className={`text-xl font-bold ${normalizedData[normalizedData.length - 1].goldChange >= 0 ? "text-green-400" : "text-red-400"}`}>
            {normalizedData[normalizedData.length - 1].goldChange >= 0 ? "+" : ""}
            {normalizedData[normalizedData.length - 1].goldChange.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
