import Header from "@/components/Header";
import MarketCapCard from "@/components/MarketCapCard";
import ComparisonChart from "@/components/ComparisonChart";
import { COLORS, GOLD_SUPPLY_TROY_OUNCES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { fetchBitcoinData, fetchGoldData } from "@/lib/api";
import { ApiResponse } from "@/types";
import Image from "next/image";

// Enable ISR with 24-hour revalidation
export const revalidate = 86400; // 24 hours in seconds

async function getMarketData(): Promise<ApiResponse> {
  try {
    // Fetch both Bitcoin and Gold data in parallel
    const [btcData, goldData] = await Promise.all([
      fetchBitcoinData(),
      fetchGoldData(),
    ]);

    // Calculate gold market cap
    const goldMarketCap = goldData.price * GOLD_SUPPLY_TROY_OUNCES;

    return {
      bitcoin: {
        price: btcData.usd,
        marketCap: btcData.usd_market_cap,
      },
      gold: {
        price: goldData.price,
        marketCap: goldMarketCap,
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching market data:", error);
    // Return fallback data
    return {
      bitcoin: { price: 0, marketCap: 0 },
      gold: { price: 0, marketCap: 0 },
      lastUpdated: new Date().toISOString(),
    };
  }
}

export default async function Home() {
  const data = await getMarketData();

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <Header />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <MarketCapCard
          name="Bitcoin"
          symbol="BTC"
          marketCap={data.bitcoin.marketCap}
          price={data.bitcoin.price}
          color={COLORS.bitcoin}
        />
        <MarketCapCard
          name="Gold"
          symbol="XAU"
          marketCap={data.gold.marketCap}
          price={data.gold.price}
          color={COLORS.gold}
        />
      </div>

      <div className="mb-8">
        <ComparisonChart
          bitcoinMarketCap={data.bitcoin.marketCap}
          goldMarketCap={data.gold.marketCap}
        />
      </div>

      <footer className="text-center py-8 mt-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-500/30 shadow-lg max-w-2xl mx-auto">
          <p className="text-gray-200 font-medium mb-3 flex items-center justify-center gap-2">
            🕒 Last updated: {formatDate(data.lastUpdated)}
          </p>
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2 flex-wrap">
            📡 Data sources: CoinGecko (Bitcoin{" "}
            <Image
              src="/bitcoin.png"
              alt="Bitcoin"
              width={16}
              height={16}
              className="w-4 h-4 inline-block"
            />
            ) & Metals API (Gold{" "}
            <Image
              src="/gold-bars.png"
              alt="Gold"
              width={16}
              height={16}
              className="w-4 h-4 inline-block"
            />
            )
          </p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs">
              💎 Built with Next.js • ⚡ Real-time market data • 📊 Live charts
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
