import { NextResponse } from "next/server";
import { fetchBitcoinData, fetchGoldData } from "@/lib/api";
import { GOLD_SUPPLY_TROY_OUNCES } from "@/lib/constants";
import { ApiResponse } from "@/types";

// Enable ISR with 24-hour revalidation
export const revalidate = 86400; // 24 hours in seconds

/**
 * GET /api/market-data
 * Fetches Bitcoin and Gold market data and returns combined response
 */
export async function GET() {
  try {
    // Fetch both Bitcoin and Gold data in parallel for efficiency
    const [btcData, goldData] = await Promise.all([
      fetchBitcoinData(),
      fetchGoldData(),
    ]);

    // Calculate gold market cap
    // Gold market cap = price per troy ounce × total supply in troy ounces
    const goldMarketCap = goldData.price * GOLD_SUPPLY_TROY_OUNCES;

    // Prepare response
    const response: ApiResponse = {
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

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    console.error("Error in market-data API route:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch market data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
