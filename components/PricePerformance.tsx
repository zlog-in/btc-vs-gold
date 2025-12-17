import { PricePerformance as PricePerformanceType } from "@/types";
import Image from "next/image";

interface PricePerformanceProps {
  asset: "bitcoin" | "gold";
  performance?: PricePerformanceType;
}

export default function PricePerformance({
  asset,
  performance,
}: PricePerformanceProps) {
  if (!performance) return null;

  const isPositive = performance.changePct24h >= 0;
  const color = asset === "bitcoin" ? "#FF9500" : "#FFC107";
  const icon = asset === "bitcoin" ? "/bitcoin.png" : "/gold-bars.png";
  const name = asset === "bitcoin" ? "Bitcoin" : "Gold";

  return (
    <div
      className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2"
      style={{ borderColor: `${color}50` }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Image src={icon} alt={name} width={28} height={28} />
        {name} Performance
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* 24h Change % */}
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">24h Change</p>
          <p
            className={`text-lg font-bold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {performance.changePct24h.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Percentage</p>
        </div>

        {/* 24h Change $ */}
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">24h Change</p>
          <p
            className={`text-lg font-bold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}$
            {Math.abs(performance.change24h).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{isPositive ? "▲" : "▼"} USD</p>
        </div>

        {/* ATH for Bitcoin */}
        {asset === "bitcoin" && performance.ath && (
          <>
            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <p className="text-gray-300 text-xs mb-1">All-Time High</p>
              <p className="text-lg font-bold text-orange-400">
                ${performance.ath.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {performance.athDate
                  ? new Date(performance.athDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <p className="text-gray-300 text-xs mb-1">Distance from ATH</p>
              <p
                className={`text-lg font-bold ${
                  performance.athDistancePct && performance.athDistancePct >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {performance.athDistancePct?.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {performance.athDistancePct && performance.athDistancePct >= 0 ? "Above" : "Below"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
