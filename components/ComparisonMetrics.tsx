import { ComparisonMetrics as ComparisonMetricsType } from "@/types";
import Image from "next/image";

interface ComparisonMetricsProps {
  comparison?: ComparisonMetricsType;
}

export default function ComparisonMetrics({ comparison }: ComparisonMetricsProps) {
  if (!comparison) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-950/30 to-purple-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-indigo-500/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        🔄 BTC vs Gold Ratios
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-black/30 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/bitcoin.png" alt="Bitcoin" width={24} height={24} />
            <p className="text-gray-300 text-sm">BTC as % of Gold</p>
          </div>
          <p className="text-3xl font-bold text-orange-400">
            {comparison.btcAsPercentOfGold.toFixed(2)}%
          </p>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
              style={{ width: `${Math.min(comparison.btcAsPercentOfGold, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/gold-bars.png" alt="Gold" width={24} height={24} />
            <p className="text-gray-300 text-sm">Gold oz per BTC</p>
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            {comparison.goldOuncesPerBtc.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            1 BTC = {comparison.goldOuncesPerBtc.toFixed(2)} oz of gold
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/bitcoin.png" alt="Bitcoin" width={24} height={24} />
            <p className="text-gray-300 text-sm">BTC Price in Gold oz</p>
          </div>
          <p className="text-3xl font-bold text-purple-400">
            {comparison.btcPricePerGoldOunce.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Ratio of BTC/XAU
          </p>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-3 border border-indigo-600/20">
        <p className="text-center text-sm text-gray-300">
          💡 Bitcoin currently represents {comparison.btcAsPercentOfGold.toFixed(1)}% of gold&apos;s market cap
        </p>
      </div>
    </div>
  );
}
