import { MiningStats as MiningStatsType } from "@/types";

interface MiningStatsProps {
  miningStats?: MiningStatsType;
}

export default function MiningStats({ miningStats }: MiningStatsProps) {
  if (!miningStats) return null;

  const formatDifficulty = (diff: number) => {
    if (diff >= 1e12) {
      return `${(diff / 1e12).toFixed(2)}T`;
    }
    return diff.toLocaleString();
  };

  const isIncreasing = miningStats.difficultyChange >= 0;

  return (
    <div className="bg-gradient-to-br from-red-950/30 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-red-600/30">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        ⛏️ Mining Difficulty
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Current Difficulty</p>
          <p className="text-xl font-bold text-red-400">
            {formatDifficulty(miningStats.difficulty)}
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Next Adjustment</p>
          <p
            className={`text-xl font-bold ${
              isIncreasing ? "text-red-400" : "text-green-400"
            }`}
          >
            {isIncreasing ? "+" : ""}
            {miningStats.difficultyChange.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Estimated</p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Blocks Until Retarget</p>
          <p className="text-xl font-bold text-pink-400">
            {miningStats.blocksUntilRetarget}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {miningStats.timeUntilRetarget}
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-xs mb-2">Retarget Height</p>
          <p className="text-xl font-bold text-orange-400">
            {miningStats.nextRetargetHeight.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-3 border border-red-600/20">
        <p className="text-center text-sm text-gray-300">
          ⛏️ Difficulty adjusts every 2016 blocks (~2 weeks) to maintain 10-minute block time
        </p>
      </div>
    </div>
  );
}
