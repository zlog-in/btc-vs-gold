import { LightningNetwork as LightningNetworkType } from "@/types";

interface LightningNetworkProps {
  lightning?: LightningNetworkType;
}

export default function LightningNetwork({ lightning }: LightningNetworkProps) {
  if (!lightning) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-950/30 to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-yellow-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        ⚡ Lightning Network
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Network Capacity</p>
          <p className="text-xl font-bold text-yellow-400">
            {lightning.capacity.toLocaleString()} BTC
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ${(lightning.capacityUsd / 1000000).toFixed(1)}M USD
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Nodes</p>
          <p className="text-xl font-bold text-orange-400">
            {lightning.nodeCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Active</p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Channels</p>
          <p className="text-xl font-bold text-amber-400">
            {lightning.channelCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Open</p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Avg per Channel</p>
          <p className="text-xl font-bold text-yellow-300">
            {(lightning.capacity / lightning.channelCount).toFixed(4)} BTC
          </p>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-3 border border-yellow-600/20">
        <p className="text-center text-sm text-gray-300">
          ⚡ Lightning Network enables instant, low-cost Bitcoin transactions
        </p>
      </div>
    </div>
  );
}
