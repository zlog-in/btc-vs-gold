import { NextResponse } from "next/server";
import { fetchBitcoinData, fetchGoldData, fetchBlockchainStats } from "@/lib/api";
import { GOLD_SUPPLY_TROY_OUNCES } from "@/lib/constants";

/**
 * API Route for manual data refresh
 * Fetches fresh Bitcoin and Gold market data
 */
export async function GET() {
  try {
    console.log("Fetching Bitcoin, Gold, and blockchain data...");

    // Fetch all data in parallel
    const [btcData, goldData, blockchainStats] = await Promise.all([
      fetchBitcoinData(),
      fetchGoldData(),
      fetchBlockchainStats(),
    ]);

    console.log("Bitcoin data:", btcData);
    console.log("Gold data:", goldData);
    console.log("Blockchain stats:", blockchainStats);

    // Calculate gold market cap
    const goldMarketCap = goldData.price * GOLD_SUPPLY_TROY_OUNCES;

    const response = {
      bitcoin: {
        price: btcData.usd,
        marketCap: btcData.usd_market_cap,
        blockchainStats: blockchainStats,
      },
      gold: {
        price: goldData.price,
        marketCap: goldMarketCap,
      },
      lastUpdated: new Date().toISOString(),
    };

    console.log("Response:", response);
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
