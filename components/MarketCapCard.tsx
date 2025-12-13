import { formatMarketCap, formatPrice } from "@/lib/utils";
import Image from "next/image";

interface MarketCapCardProps {
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
  color: string;
}

export default function MarketCapCard({
  name,
  symbol,
  marketCap,
  price,
  color,
}: MarketCapCardProps) {
  const bgGradient =
    symbol === "BTC"
      ? "from-orange-950/30 to-orange-900/20"
      : "from-yellow-950/30 to-yellow-900/20";
  const borderColor =
    symbol === "BTC" ? "border-orange-800/50" : "border-yellow-800/50";

  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border-2 ${borderColor} hover:shadow-xl hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-6">
        {symbol === "BTC" ? (
          <Image
            src="/bitcoin.png"
            alt="Bitcoin"
            width={56}
            height={56}
            className="w-14 h-14"
          />
        ) : (
          <Image
            src="/gold-bars.png"
            alt="Gold"
            width={56}
            height={56}
            className="w-14 h-14"
          />
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {name}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-2 flex items-center gap-1">
            📈 Market Cap
          </p>
          <p className="text-3xl md:text-4xl font-bold" style={{ color }}>
            {formatMarketCap(marketCap)}
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-2 flex items-center gap-1">
            💵 Price per {symbol === "BTC" ? "BTC" : "Troy Ounce"}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-gray-100">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </div>
  );
}
