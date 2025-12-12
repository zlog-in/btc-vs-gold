import {
  BitcoinData,
  GoldData,
  CoinGeckoResponse,
} from "@/types";
import { COINGECKO_API_URL } from "./constants";

/**
 * Fetch Bitcoin price and market cap from CoinGecko API
 * @returns Bitcoin data with price and market cap
 */
export async function fetchBitcoinData(): Promise<BitcoinData> {
  try {
    const response = await fetch(COINGECKO_API_URL, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(
        `CoinGecko API error: ${response.status} ${response.statusText}`
      );
    }

    const data: CoinGeckoResponse = await response.json();

    if (!data.bitcoin || !data.bitcoin.usd || !data.bitcoin.usd_market_cap) {
      throw new Error("Invalid Bitcoin data received from CoinGecko API");
    }

    return data.bitcoin;
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error);
    // Return fallback data in case of error
    return {
      usd: 0,
      usd_market_cap: 0,
    };
  }
}

/**
 * Fetch gold price from free public API (no authentication required)
 * Uses GoldAPI.io free tier which doesn't require API key for basic requests
 * @returns Gold price per troy ounce
 */
export async function fetchGoldData(): Promise<GoldData> {
  try {
    // Try free gold price API (no auth required)
    const response = await fetch(
      "https://www.goldapi.io/api/XAU/USD",
      {
        headers: {
          "x-access-token": "goldapi-demo", // Demo token, no signup needed
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.price) {
        return { price: data.price };
      }
    }

    // Fallback: Try alternative free API
    const fallbackResponse = await fetch(
      "https://data-asg.goldprice.org/dbXRates/USD",
      {
        next: { revalidate: 86400 },
      }
    );

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      // GoldPrice.org returns price per ounce in their items array
      if (fallbackData.items && fallbackData.items.length > 0) {
        const xauPrice = fallbackData.items[0].xauPrice;
        if (xauPrice) {
          return { price: parseFloat(xauPrice) };
        }
      }
    }

    // If both APIs fail, use estimated current gold price
    console.warn("Gold APIs unavailable, using estimated price");
    return { price: 2650 };
  } catch (error) {
    console.error("Error fetching gold data:", error);
    // Return estimated gold price as fallback (~$2,650 per oz)
    return { price: 2650 };
  }
}
