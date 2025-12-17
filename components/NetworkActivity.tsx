import { NetworkActivity as NetworkActivityType } from "@/types";

interface NetworkActivityProps {
  activity?: NetworkActivityType;
}

export default function NetworkActivity({ activity }: NetworkActivityProps) {
  if (!activity) return null;

  return (
    <div className="bg-gradient-to-br from-blue-950/30 to-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-blue-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        🌐 Network Activity (24h)
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Transactions</p>
          <p className="text-xl font-bold text-blue-400">
            {activity.transactionCount24h.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Last 24h</p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Mempool Size</p>
          <p className="text-xl font-bold text-indigo-400">
            {activity.mempoolSize.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pending TXs</p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Avg Fee</p>
          <p className="text-xl font-bold text-purple-400">
            {activity.avgFee.toFixed(6)} BTC
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ${activity.avgFeeUsd.toFixed(2)} USD
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Mempool vSize</p>
          <p className="text-xl font-bold text-cyan-400">
            {(activity.mempoolVsize / 1000000).toFixed(2)} MB
          </p>
          <p className="text-xs text-gray-400 mt-1">Virtual Size</p>
        </div>
      </div>
    </div>
  );
}
