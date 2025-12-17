import { NextResponse } from "next/server";
import {
  fetchBitcoinData,
  fetchGoldData,
  fetchBlockchainStats,
  calculateBitcoinPerformance,
  getGoldSupplyDemand,
  fetchHistoricalData,
  calculatePerformanceComparison,
  calculateVolatility,
} from "@/lib/api";
import { GOLD_SUPPLY_TROY_OUNCES } from "@/lib/constants";
import { ComparisonMetrics } from "@/types";

/**
 * API Route for manual data refresh
 * Fetches fresh Bitcoin and Gold market data with all metrics
 */
export async function GET() {
  try {
    console.log("Fetching Bitcoin, Gold, and all market data...");

    // Fetch basic data first
    const [btcData, goldData] = await Promise.all([
      fetchBitcoinData(),
      fetchGoldData(),
    ]);

    // Now fetch blockchain stats with BTC price
    const blockchainStats = await fetchBlockchainStats(btcData.usd);

    // Fetch historical data
    const historicalData = await fetchHistoricalData();

    console.log("Bitcoin data:", btcData);
    console.log("Gold data:", goldData);
    console.log("Blockchain stats:", blockchainStats);

    // Calculate gold market cap
    const goldMarketCap = goldData.price * GOLD_SUPPLY_TROY_OUNCES;

    // Calculate Bitcoin price performance
    const btcPerformance = calculateBitcoinPerformance(btcData);

    // Calculate gold price performance
    const goldPerformance = {
      change24h: goldData.change_24h || 0,
      changePct24h: goldData.change_pct_24h || 0,
    };

    // Get gold supply and demand data
    const goldSupplyDemand = getGoldSupplyDemand();

    // Calculate comparison metrics
    const comparisonMetrics: ComparisonMetrics = {
      btcAsPercentOfGold: (btcData.usd_market_cap / goldMarketCap) * 100,
      btcPricePerGoldOunce: btcData.usd / goldData.price,
      goldOuncesPerBtc: btcData.usd / goldData.price,
    };

    // Calculate performance comparison
    const performanceComparison = calculatePerformanceComparison(
      historicalData,
      btcData.usd,
      goldData.price
    );

    // Calculate volatility metrics
    const volatilityMetrics = calculateVolatility(historicalData);

    const response = {
      bitcoin: {
        price: btcData.usd,
        marketCap: btcData.usd_market_cap,
        blockchainStats: blockchainStats,
        pricePerformance: btcPerformance,
      },
      gold: {
        price: goldData.price,
        marketCap: goldMarketCap,
        pricePerformance: goldPerformance,
        supplyDemand: goldSupplyDemand,
      },
      comparison: comparisonMetrics,
      performanceComparison,
      volatilityMetrics,
      historicalData: historicalData.slice(-90), // Last 90 days for charts
      lastUpdated: new Date().toISOString(),
    };

    console.log("Response prepared with all metrics");
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch market data",
        bitcoin: { price: 0, marketCap: 0 },
        gold: { price: 0, marketCap: 0 },
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
