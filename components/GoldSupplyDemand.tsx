"use client";

import { GoldSupplyDemand as GoldSupplyDemandType } from "@/types";
import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface GoldSupplyDemandProps {
  supplyDemand?: GoldSupplyDemandType;
}

export default function GoldSupplyDemand({ supplyDemand }: GoldSupplyDemandProps) {
  if (!supplyDemand) return null;

  const demandData = [
    { name: "Jewelry", value: supplyDemand.demandJewelry, color: "#FFC107" },
    { name: "Investment", value: supplyDemand.demandInvestment, color: "#FFD54F" },
    { name: "Industry", value: supplyDemand.demandIndustry, color: "#FFE082" },
    { name: "Central Banks", value: supplyDemand.demandCentralBanks, color: "#FFECB3" },
  ];

  return (
    <div className="bg-gradient-to-br from-yellow-950/30 to-amber-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-yellow-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Image src="/gold-bars.png" alt="Gold" width={32} height={32} />
        Gold Supply & Demand
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Supply Stats */}
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <p className="text-gray-300 text-xs mb-2">Total Supply</p>
              <p className="text-xl font-bold text-yellow-400">
                {(supplyDemand.totalSupply / 1000000000).toFixed(2)}B oz
              </p>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <p className="text-gray-300 text-xs mb-2">Annual Production</p>
              <p className="text-xl font-bold text-amber-400">
                {(supplyDemand.annualProduction / 1000000).toFixed(0)}M oz/yr
              </p>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-semibold text-gray-200 mb-3">Demand Breakdown</h4>
            {demandData.map((item) => (
              <div key={item.name} className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demand Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={demandData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {demandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl p-3 border border-yellow-600/20">
        <p className="text-center text-sm text-gray-300">
          📊 Data based on World Gold Council 2024 estimates
        </p>
      </div>
    </div>
  );
}
