import { BlockchainStats as BlockchainStatsType } from "@/types";
import Image from "next/image";

interface BlockchainStatsProps {
  stats?: BlockchainStatsType;
}

export default function BlockchainStats({ stats }: BlockchainStatsProps) {
  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-orange-950/30 to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border-2 border-orange-800/50">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Image
          src="/bitcoin.png"
          alt="Bitcoin"
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10"
        />
        Bitcoin Stats
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Total Supply */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10">
          <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2">
            💰 Total Supply
          </p>
          <p className="text-lg md:text-xl font-bold text-orange-400 break-words">
            {stats.totalSupply.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">BTC</p>
        </div>

        {/* Block Height */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10">
          <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2">
            🧱 Block Height
          </p>
          <p className="text-lg md:text-xl font-bold text-orange-400 break-words">
            {stats.blockHeight.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Latest</p>
        </div>

        {/* Hash Rate */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10">
          <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2">
            ⚡ Mining Hash Rate
          </p>
          <p className="text-lg md:text-xl font-bold text-orange-400 break-words">
            {stats.hashRate.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">EH/s</p>
        </div>

        {/* Time Since Genesis */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10">
          <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2">
            ⏰ Since Genesis
          </p>
          <p className="text-lg md:text-xl font-bold text-orange-400 break-words">
            {stats.timeSinceGenesis.years}y {stats.timeSinceGenesis.months}m{" "}
            {stats.timeSinceGenesis.days}d
          </p>
        </div>
      </div>
    </div>
  );
}
