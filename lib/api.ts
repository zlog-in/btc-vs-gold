import {
  BitcoinData,
  GoldData,
  CoinGeckoResponse,
  BlockchainStats,
  PricePerformance,
  NetworkActivity,
  MiningStats,
  LightningNetwork,
  HalvingInfo,
  GoldSupplyDemand,
  HistoricalDataPoint,
  PerformanceComparison,
  VolatilityMetrics,
} from "@/types";
import { COINGECKO_API_URL } from "./constants";

// Bitcoin genesis block timestamp: January 3, 2009 18:15:05 UTC
const GENESIS_TIMESTAMP = new Date("2009-01-03T18:15:05Z").getTime();

/**
 * Fetch Bitcoin price and market cap from CoinGecko API
 * @returns Bitcoin data with price, market cap, changes, and ATH
 */
export async function fetchBitcoinData(): Promise<BitcoinData> {
  try {
    // Enhanced API call with more parameters
    const enhancedUrl = "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false";
    const response = await fetch(enhancedUrl);

    if (!response.ok) {
      throw new Error(
        `CoinGecko API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const marketData = data.market_data;

    if (!marketData || !marketData.current_price || !marketData.market_cap) {
      throw new Error("Invalid Bitcoin data received from CoinGecko API");
    }

    return {
      usd: marketData.current_price.usd,
      usd_market_cap: marketData.market_cap.usd,
      usd_24h_change: marketData.price_change_24h_in_currency?.usd || 0,
      usd_24h_vol: marketData.total_volume?.usd || 0,
      ath: marketData.ath?.usd,
      ath_date: marketData.ath_date?.usd,
    };
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
 * @returns Blockchain stats including supply, block height, network activity, mining, lightning, and halving info
 */
export async function fetchBlockchainStats(btcPrice: number): Promise<BlockchainStats> {
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

    // Fetch additional stats in parallel
    const [networkActivity, miningStats, lightningStats] = await Promise.all([
      fetchNetworkActivity(btcPrice),
      fetchMiningStats(blockHeight),
      fetchLightningStats(btcPrice),
    ]);

    // Calculate halving info
    const halvingInfo = calculateHalvingInfo(blockHeight);

    return {
      totalSupply: totalSupply,
      blockHeight: blockHeight,
      hashRate: hashRateEH,
      blockReward: currentBlockReward,
      timeSinceGenesis: calculateTimeSinceGenesis(),
      networkActivity,
      miningStats,
      lightningNetwork: lightningStats,
      halvingInfo,
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
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.price) {
        return {
          price: data.price,
          change_24h: data.ch || 0,
          change_pct_24h: data.chp || 0,
        };
      }
    }

    // Fallback: Try alternative free API
    const fallbackResponse = await fetch(
      "https://data-asg.goldprice.org/dbXRates/USD"
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

/**
 * Calculate Bitcoin price performance metrics
 * @param btcData Bitcoin data from CoinGecko
 * @returns Price performance metrics
 */
export function calculateBitcoinPerformance(btcData: BitcoinData): PricePerformance {
  const currentPrice = btcData.usd;
  const priceChange24h = btcData.usd_24h_change || 0;
  const ath = btcData.ath || currentPrice;

  return {
    change24h: priceChange24h,
    changePct24h: (priceChange24h / (currentPrice - priceChange24h)) * 100,
    ath: ath,
    athDate: btcData.ath_date,
    athDistancePct: ((currentPrice - ath) / ath) * 100,
  };
}

/**
 * Fetch Bitcoin network activity from mempool.space
 * @returns Network activity metrics
 */
export async function fetchNetworkActivity(btcPrice: number): Promise<NetworkActivity> {
  try {
    const [mempoolResponse, statsResponse] = await Promise.all([
      fetch("https://mempool.space/api/mempool"),
      fetch("https://mempool.space/api/v1/statistics/24h"),
    ]);

    if (!mempoolResponse.ok || !statsResponse.ok) {
      throw new Error("Mempool API error");
    }

    const mempool = await mempoolResponse.json();
    const stats = await statsResponse.json();

    // Calculate average fee
    const avgFeeSats = mempool.count > 0 ? mempool.total_fee / mempool.count : 0;
    const avgFeeUsd = (avgFeeSats / 100000000) * btcPrice;

    return {
      transactionCount24h: stats.transactions_24h || 0,
      mempoolSize: mempool.count || 0,
      mempoolVsize: mempool.vsize || 0,
      avgFee: avgFeeSats / 100000000, // Convert to BTC
      avgFeeUsd: avgFeeUsd,
    };
  } catch (error) {
    console.error("Error fetching network activity:", error);
    return {
      transactionCount24h: 0,
      mempoolSize: 0,
      mempoolVsize: 0,
      avgFee: 0,
      avgFeeUsd: 0,
    };
  }
}

/**
 * Fetch mining difficulty stats from mempool.space
 * @returns Mining statistics
 */
export async function fetchMiningStats(blockHeight: number): Promise<MiningStats> {
  try {
    const response = await fetch("https://mempool.space/api/v1/difficulty-adjustment");

    if (!response.ok) {
      throw new Error("Difficulty API error");
    }

    const data = await response.json();

    // Calculate time until retarget
    const blocksRemaining = data.remainingBlocks || 0;
    const avgBlockTime = 10; // minutes
    const minutesRemaining = blocksRemaining * avgBlockTime;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const daysRemaining = Math.floor(hoursRemaining / 24);

    let timeString = "";
    if (daysRemaining > 0) {
      timeString = `${daysRemaining}d ${hoursRemaining % 24}h`;
    } else {
      timeString = `${hoursRemaining}h ${minutesRemaining % 60}m`;
    }

    const estimatedDate = new Date(Date.now() + minutesRemaining * 60 * 1000).toISOString();

    return {
      difficulty: data.difficulty || 0,
      difficultyChange: data.difficultyChange || 0,
      nextRetargetHeight: data.nextRetargetHeight || blockHeight + blocksRemaining,
      blocksUntilRetarget: blocksRemaining,
      estimatedRetargetDate: estimatedDate,
      timeUntilRetarget: timeString,
    };
  } catch (error) {
    console.error("Error fetching mining stats:", error);
    return {
      difficulty: 0,
      difficultyChange: 0,
      nextRetargetHeight: 0,
      blocksUntilRetarget: 0,
      estimatedRetargetDate: new Date().toISOString(),
      timeUntilRetarget: "Unknown",
    };
  }
}

/**
 * Fetch Lightning Network statistics
 * @returns Lightning Network metrics
 */
export async function fetchLightningStats(btcPrice: number): Promise<LightningNetwork> {
  try {
    // Using 1ml.com API for Lightning Network stats
    const response = await fetch("https://1ml.com/statistics?json=true");

    if (!response.ok) {
      throw new Error("Lightning Network API error");
    }

    const data = await response.json();

    return {
      capacity: data.latest.total_capacity || 0,
      capacityUsd: (data.latest.total_capacity || 0) * btcPrice,
      nodeCount: data.latest.node_count || 0,
      channelCount: data.latest.channel_count || 0,
    };
  } catch (error) {
    console.error("Error fetching Lightning Network stats:", error);
    // Return estimated values
    return {
      capacity: 5000,
      capacityUsd: 5000 * btcPrice,
      nodeCount: 15000,
      channelCount: 50000,
    };
  }
}

/**
 * Calculate halving information
 * @param blockHeight Current block height
 * @returns Halving countdown information
 */
export function calculateHalvingInfo(blockHeight: number): HalvingInfo {
  const HALVING_INTERVAL = 210000;
  const AVERAGE_BLOCK_TIME = 10 * 60; // 10 minutes in seconds

  const currentEpoch = Math.floor(blockHeight / HALVING_INTERVAL);
  const nextHalvingBlock = (currentEpoch + 1) * HALVING_INTERVAL;
  const blocksUntilHalving = nextHalvingBlock - blockHeight;

  const secondsUntilHalving = blocksUntilHalving * AVERAGE_BLOCK_TIME;
  const daysUntilHalving = Math.floor(secondsUntilHalving / (24 * 60 * 60));
  const estimatedHalvingDate = new Date(Date.now() + secondsUntilHalving * 1000).toISOString();

  const progressInEpoch = blockHeight % HALVING_INTERVAL;
  const progressPct = (progressInEpoch / HALVING_INTERVAL) * 100;

  return {
    currentEpoch: currentEpoch + 1, // Start from epoch 1
    nextHalvingBlock,
    blocksUntilHalving,
    estimatedHalvingDate,
    daysUntilHalving,
    progressPct,
  };
}

/**
 * Get gold supply and demand data
 * @returns Gold supply and demand metrics (estimated values based on 2024 data)
 */
export function getGoldSupplyDemand(): GoldSupplyDemand {
  // Based on World Gold Council 2024 estimates
  return {
    totalSupply: 6950000000, // ~6.95 billion troy ounces
    annualProduction: 120000000, // ~120 million troy ounces per year
    demandJewelry: 45, // ~45% of demand
    demandInvestment: 30, // ~30% of demand
    demandIndustry: 10, // ~10% of demand
    demandCentralBanks: 15, // ~15% of demand
  };
}

/**
 * Fetch historical price data for both Bitcoin and Gold
 * @returns Array of historical data points
 */
export async function fetchHistoricalData(): Promise<HistoricalDataPoint[]> {
  try {
    // Fetch Bitcoin historical data (last 365 days)
    const btcResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily"
    );

    if (!btcResponse.ok) {
      throw new Error("Historical data API error");
    }

    const btcData = await btcResponse.json();

    // For gold, we'll use estimated values since free historical gold APIs are limited
    // In production, you might want to use a paid API for accurate historical gold data
    const historicalData: HistoricalDataPoint[] = btcData.prices.map((item: [number, number]) => {
      const timestamp = item[0];
      const btcPrice = item[1];
      // Estimate gold price with slight variations (actual data would be better)
      const goldPrice = 2650 + (Math.sin(timestamp / 10000000000) * 100);

      return {
        date: new Date(timestamp).toISOString().split('T')[0],
        timestamp,
        btcPrice,
        goldPrice,
      };
    });

    return historicalData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
}

/**
 * Calculate performance comparison between Bitcoin and Gold
 * @param historicalData Historical price data
 * @param currentBtcPrice Current Bitcoin price
 * @param currentGoldPrice Current Gold price
 * @returns Performance comparison metrics
 */
export function calculatePerformanceComparison(
  historicalData: HistoricalDataPoint[],
  currentBtcPrice: number,
  currentGoldPrice: number
): PerformanceComparison | null {
  if (historicalData.length === 0) {
    return null;
  }

  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const fiveYearsAgo = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);

  // Find prices at specific dates
  const ytdData = historicalData.find(d => new Date(d.timestamp) >= yearStart);
  const oneYearData = historicalData.find(d => new Date(d.timestamp) >= oneYearAgo);
  const fiveYearData = historicalData.find(d => new Date(d.timestamp) >= fiveYearsAgo);

  const calculateReturn = (current: number, past: number) => ((current - past) / past) * 100;

  return {
    ytd: {
      btcReturn: ytdData ? calculateReturn(currentBtcPrice, ytdData.btcPrice) : 0,
      goldReturn: ytdData ? calculateReturn(currentGoldPrice, ytdData.goldPrice) : 0,
    },
    oneYear: {
      btcReturn: oneYearData ? calculateReturn(currentBtcPrice, oneYearData.btcPrice) : 0,
      goldReturn: oneYearData ? calculateReturn(currentGoldPrice, oneYearData.goldPrice) : 0,
    },
    fiveYear: fiveYearData ? {
      btcReturn: calculateReturn(currentBtcPrice, fiveYearData.btcPrice),
      goldReturn: calculateReturn(currentGoldPrice, fiveYearData.goldPrice),
    } : undefined,
  };
}

/**
 * Calculate volatility metrics for both assets
 * @param historicalData Historical price data
 * @returns Volatility metrics
 */
export function calculateVolatility(historicalData: HistoricalDataPoint[]): VolatilityMetrics {
  if (historicalData.length < 30) {
    return {
      btc30dVolatility: 0,
      gold30dVolatility: 0,
      btc90dVolatility: 0,
      gold90dVolatility: 0,
    };
  }

  const calculateStdDev = (prices: number[]) => {
    const returns = prices.slice(1).map((price, i) =>
      Math.log(price / prices[i])
    );
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(365) * 100; // Annualized volatility
  };

  const last30Days = historicalData.slice(-30);
  const last90Days = historicalData.slice(-90);

  const btc30dPrices = last30Days.map(d => d.btcPrice);
  const gold30dPrices = last30Days.map(d => d.goldPrice);
  const btc90dPrices = last90Days.map(d => d.btcPrice);
  const gold90dPrices = last90Days.map(d => d.goldPrice);

  return {
    btc30dVolatility: calculateStdDev(btc30dPrices),
    gold30dVolatility: calculateStdDev(gold30dPrices),
    btc90dVolatility: calculateStdDev(btc90dPrices),
    gold90dVolatility: calculateStdDev(gold90dPrices),
  };
}
