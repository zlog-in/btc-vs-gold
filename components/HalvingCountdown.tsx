import { HalvingInfo } from "@/types";
import Image from "next/image";

interface HalvingCountdownProps {
  halvingInfo?: HalvingInfo;
}

export default function HalvingCountdown({ halvingInfo }: HalvingCountdownProps) {
  if (!halvingInfo) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-950/30 to-blue-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-purple-500/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Image src="/bitcoin.png" alt="Bitcoin" width={32} height={32} />
        ⏰ Next Halving Countdown
      </h3>

      <div className="mb-4">
        <div className="bg-black/40 rounded-xl p-4 border border-purple-400/30">
          <p className="text-gray-300 text-sm mb-2">Progress to Halving {halvingInfo.currentEpoch + 1}</p>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${halvingInfo.progressPct}%` }}
            />
          </div>
          <p className="text-right text-sm text-gray-400">
            {halvingInfo.progressPct.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">Blocks Remaining</p>
          <p className="text-xl font-bold text-purple-400">
            {halvingInfo.blocksUntilHalving.toLocaleString()}
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">Days Until</p>
          <p className="text-xl font-bold text-pink-400">
            ~{halvingInfo.daysUntilHalving.toLocaleString()}
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10 col-span-2">
          <p className="text-gray-300 text-xs mb-1">Estimated Date</p>
          <p className="text-lg font-bold text-blue-400">
            {formatDate(halvingInfo.estimatedHalvingDate)}
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">Current Epoch</p>
          <p className="text-xl font-bold text-orange-400">
            {halvingInfo.currentEpoch}
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-gray-300 text-xs mb-1">Next Block</p>
          <p className="text-xl font-bold text-yellow-400">
            {halvingInfo.nextHalvingBlock.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-3 border border-purple-400/20">
        <p className="text-center text-sm text-gray-300">
          After the halving, block rewards will decrease from{" "}
          <span className="font-bold text-orange-400">3.125 BTC</span> to{" "}
          <span className="font-bold text-purple-400">1.5625 BTC</span>
        </p>
      </div>
    </div>
  );
}
