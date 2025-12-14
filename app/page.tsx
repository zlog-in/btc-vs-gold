"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MarketCapCard from "@/components/MarketCapCard";
import ComparisonChart from "@/components/ComparisonChart";
import { COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ApiResponse } from "@/types";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState<ApiResponse>({
    bitcoin: { price: 0, marketCap: 0 },
    gold: { price: 0, marketCap: 0 },
    lastUpdated: new Date().toISOString(),
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      console.log("Fetching data from /api/refresh...");
      const response = await fetch("/api/refresh");
      console.log("Response status:", response.status);
      const newData: ApiResponse = await response.json();
      console.log("Received data:", newData);
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-300 text-xl">Loading market data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

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
