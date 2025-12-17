"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MarketCapCard from "@/components/MarketCapCard";
import ComparisonChart from "@/components/ComparisonChart";
import BlockchainStats from "@/components/BlockchainStats";
import PricePerformance from "@/components/PricePerformance";
import HalvingCountdown from "@/components/HalvingCountdown";
import LightningNetwork from "@/components/LightningNetwork";
import NetworkActivity from "@/components/NetworkActivity";
import MiningStats from "@/components/MiningStats";
import GoldSupplyDemand from "@/components/GoldSupplyDemand";
import ComparisonMetrics from "@/components/ComparisonMetrics";
import PerformanceChart from "@/components/PerformanceChart";
import HistoricalChart from "@/components/HistoricalChart";
import VolatilityMetrics from "@/components/VolatilityMetrics";
import { COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ApiResponse } from "@/types";

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
      console.log("Fetching all data from /api/refresh...");

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/refresh?t=${timestamp}`, {
        cache: 'no-store',
      });

      console.log("Response status:", response.status);
      const newData: ApiResponse = await response.json();
      console.log("Received data:", newData);
      console.log("Bitcoin Stats:", newData.bitcoin.blockchainStats);

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
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Market Cap Cards */}
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

      {/* Price Performance */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <PricePerformance asset="bitcoin" performance={data.bitcoin.pricePerformance} />
        <PricePerformance asset="gold" performance={data.gold.pricePerformance} />
      </div>

      {/* Market Cap Comparison */}
      <div className="mb-8">
        <ComparisonChart
          bitcoinMarketCap={data.bitcoin.marketCap}
          goldMarketCap={data.gold.marketCap}
        />
      </div>

      {/* Comparison Metrics */}
      <div className="mb-8">
        <ComparisonMetrics comparison={data.comparison} />
      </div>

      {/* Bitcoin Blockchain Statistics */}
      <div className="mb-8">
        <BlockchainStats stats={data.bitcoin.blockchainStats} />
      </div>

      {/* Bitcoin Network Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <NetworkActivity activity={data.bitcoin.blockchainStats?.networkActivity} />
        <MiningStats miningStats={data.bitcoin.blockchainStats?.miningStats} />
      </div>

      {/* Lightning & Halving */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <LightningNetwork lightning={data.bitcoin.blockchainStats?.lightningNetwork} />
        <HalvingCountdown halvingInfo={data.bitcoin.blockchainStats?.halvingInfo} />
      </div>

      {/* Gold Supply & Demand */}
      <div className="mb-8">
        <GoldSupplyDemand supplyDemand={data.gold.supplyDemand} />
      </div>

      {/* Performance Comparison */}
      <div className="mb-8">
        <PerformanceChart performance={data.performanceComparison} />
      </div>

      {/* Historical Chart */}
      <div className="mb-8">
        <HistoricalChart historicalData={data.historicalData} />
      </div>

      {/* Volatility Metrics */}
      <div className="mb-8">
        <VolatilityMetrics volatility={data.volatilityMetrics} />
      </div>

      <footer className="text-center py-8 mt-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-500/30 shadow-lg max-w-2xl mx-auto">
          <p className="text-gray-200 font-medium mb-3 flex items-center justify-center gap-2">
            🕒 Updated: {formatDate(data.lastUpdated)}
          </p>
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2 flex-wrap">
            📡 Sources: CoinGecko • Mempool.space • GoldAPI • 1ml.com
          </p>
        </div>
      </footer>
    </main>
  );
}
