"use client";

import { COLORS } from "@/lib/constants";
import Image from "next/image";

interface ComparisonChartProps {
  bitcoinMarketCap: number;
  goldMarketCap: number;
}

export default function ComparisonChart({
  bitcoinMarketCap,
  goldMarketCap,
}: ComparisonChartProps) {
  const total = bitcoinMarketCap + goldMarketCap;
  const btcPercentage = (bitcoinMarketCap / total) * 100;
  const goldPercentage = (goldMarketCap / total) * 100;

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border-2 border-purple-500/30">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
        📊 Market Cap Comparison
      </h2>

      {/* Horizontal Bar */}
      <div className="relative h-16 md:h-20 flex rounded-2xl overflow-hidden shadow-lg border-2 border-gray-700">
        {/* Bitcoin Section */}
        <div
          className="transition-all duration-500 relative group"
          style={{
            width: `${btcPercentage}%`,
            backgroundColor: COLORS.bitcoin,
          }}
        >
          {/* Hover effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
        </div>

        {/* Gold Section */}
        <div
          className="transition-all duration-500 relative group"
          style={{
            width: `${goldPercentage}%`,
            backgroundColor: COLORS.gold,
          }}
        >
          {/* Hover effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
        </div>
      </div>

      {/* Percentage Labels Below */}
      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-2">
          <Image
            src="/bitcoin.png"
            alt="Bitcoin"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-bold text-lg md:text-xl" style={{ color: COLORS.bitcoin }}>
            {btcPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg md:text-xl" style={{ color: COLORS.gold }}>
            {goldPercentage.toFixed(1)}%
          </span>
          <Image
            src="/gold-bars.png"
            alt="Gold"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
      </div>
    </div>
  );
}
