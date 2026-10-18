import {
  BitcoinData,
  GoldData,
  CoinGeckoResponse,
  BlockchainStats,
} from "@/types";
import { COINGECKO_API_URL } from "./constants";

// Bitcoin genesis block timestamp: January 3, 2009 18:15:05 UTC
const GENESIS_TIMESTAMP = new Date("2009-01-03T18:15:05Z").getTime();

/**
 * Fetch Bitcoin price and market cap from CoinGecko API
 * @returns Bitcoin data with price and market cap
 */
export async function fetchBitcoinData(): Promise<BitcoinData> {
  try {
    const response = await fetch(COINGECKO_API_URL);

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
 * Calculate time passed since Bitcoin genesis block
 * @returns Years, months, and days since genesis
 */
function calculateTimeSinceGenesis(): { years: number; months: number; days: number } {
  const now = Date.now();
  const millisecondsSinceGenesis = now - GENESIS_TIMESTAMP;

  // Convert to days
  const totalDays = Math.floor(millisecondsSinceGenesis / (1000 * 60 * 60 * 24));

  // Calculate years (approximate: 365.25 days per year)
  const years = Math.floor(totalDays / 365.25);
  const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);

  // Calculate months (approximate: 30.44 days per month)
  const months = Math.floor(remainingDaysAfterYears / 30.44);
  const days = Math.floor(remainingDaysAfterYears - (months * 30.44));

  return { years, months, days };
}

/**
 * Fetch Bitcoin blockchain statistics from mempool.space API
 * @returns Blockchain stats including supply, block height, and time since genesis
 */
export async function fetchBlockchainStats(): Promise<BlockchainStats> {
  try {
    // Fetch blockchain stats and hash rate from mempool.space in parallel
    const [heightResponse, hashRateResponse] = await Promise.all([
      fetch("https://mempool.space/api/v1/blocks/tip/height"),
      fetch("https://mempool.space/api/v1/mining/hashrate/3d"),
    ]);

    if (!heightResponse.ok || !hashRateResponse.ok) {
      throw new Error(`Mempool API error`);
    }

    const blockHeight = await heightResponse.json();
    const hashRateData = await hashRateResponse.json();

    // Calculate total supply (block subsidy halves every 210,000 blocks)
    // Simplified calculation: each halving period
    let totalSupply = 0;
    let currentHeight = 0;
    let subsidy = 50; // Initial block reward

    while (currentHeight < blockHeight) {
      const blocksInPeriod = Math.min(210000, blockHeight - currentHeight);
      totalSupply += blocksInPeriod * subsidy;
      currentHeight += blocksInPeriod;
      subsidy /= 2;
    }

    // Calculate current block reward based on number of halvings
    const halvingPeriod = 210000;
    const halvingCount = Math.floor(blockHeight / halvingPeriod);
    const currentBlockReward = 50 / Math.pow(2, halvingCount);

    // Convert hash rate to EH/s (exahashes per second)
    // mempool.space returns hash rate in H/s
    const hashRateEH = hashRateData.currentHashrate / 1e18;

    return {
      totalSupply: totalSupply,
      blockHeight: blockHeight,
      hashRate: hashRateEH,
      blockReward: currentBlockReward,
      timeSinceGenesis: calculateTimeSinceGenesis(),
    };
  } catch (error) {
    console.error("Error fetching blockchain stats:", error);
    // Return estimated values as fallback
    return {
      totalSupply: 19800000, // Approximate current supply
      blockHeight: 870000, // Approximate current height
      hashRate: 600, // Approximate current hash rate in EH/s
      blockReward: 3.125, // Current block reward after 4th halving
      timeSinceGenesis: calculateTimeSinceGenesis(),
    };
  }
}

/**
 * Fetch gold spot price from free public APIs (no authentication required)
 * Primary: gold-api.com spot XAU/USD
 * Fallback: CoinGecko PAX Gold (each token is backed by 1 troy ounce of gold)
 * @returns Gold price per troy ounce
 */
export async function fetchGoldData(): Promise<GoldData> {
  try {
    const response = await fetch("https://api.gold-api.com/price/XAU");

    if (response.ok) {
      const data = await response.json();
      if (typeof data.price === "number" && data.price > 0) {
        return { price: data.price };
      }
    }
  } catch (error) {
    console.error("Error fetching gold data from gold-api.com:", error);
  }

  try {
    const fallbackResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd"
    );

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      const paxgPrice = fallbackData["pax-gold"]?.usd;
      if (typeof paxgPrice === "number" && paxgPrice > 0) {
        return { price: paxgPrice };
      }
    }
  } catch (error) {
    console.error("Error fetching gold data from CoinGecko:", error);
  }

  // If both APIs fail, use estimated current gold price (~$4,150 per oz)
  console.warn("Gold APIs unavailable, using estimated price");
  return { price: 4150 };
}
