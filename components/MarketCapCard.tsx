import { formatMarketCap, formatPrice } from "@/lib/utils";

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
  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-xl border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-textSecondary text-sm mb-1">Market Cap</p>
          <p className="text-3xl md:text-4xl font-bold" style={{ color }}>
            {formatMarketCap(marketCap)}
          </p>
        </div>

        <div>
          <p className="text-textSecondary text-sm mb-1">
            Price per {symbol === "BTC" ? "BTC" : "Troy Ounce"}
          </p>
          <p className="text-xl md:text-2xl font-semibold">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </div>
  );
}
