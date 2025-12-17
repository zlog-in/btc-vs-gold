export interface BitcoinData {
  usd: number;
  usd_market_cap: number;
  usd_24h_change?: number;
  usd_24h_vol?: number;
  ath?: number;
  ath_date?: string;
}

export interface GoldData {
  price: number;
  change_24h?: number;
  change_pct_24h?: number;
}

export interface MarketCapData {
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
  color: string;
}

export interface PricePerformance {
  change24h: number;
  changePct24h: number;
  change7d?: number;
  changePct7d?: number;
  change30d?: number;
  changePct30d?: number;
  ath?: number;
  athDate?: string;
  athDistancePct?: number;
}

export interface NetworkActivity {
  transactionCount24h: number;
  mempoolSize: number;
  mempoolVsize: number;
  avgFee: number;
  avgFeeUsd: number;
}

export interface MiningStats {
  difficulty: number;
  difficultyChange: number;
  nextRetargetHeight: number;
  blocksUntilRetarget: number;
  estimatedRetargetDate: string;
  timeUntilRetarget: string;
}

export interface LightningNetwork {
  capacity: number;
  capacityUsd: number;
  nodeCount: number;
  channelCount: number;
}

export interface HalvingInfo {
  currentEpoch: number;
  nextHalvingBlock: number;
  blocksUntilHalving: number;
  estimatedHalvingDate: string;
  daysUntilHalving: number;
  progressPct: number;
}

export interface BlockchainStats {
  totalSupply: number;
  blockHeight: number;
  hashRate: number;
  blockReward: number;
  timeSinceGenesis: {
    years: number;
    months: number;
    days: number;
  };
  networkActivity?: NetworkActivity;
  miningStats?: MiningStats;
  lightningNetwork?: LightningNetwork;
  halvingInfo?: HalvingInfo;
}

export interface GoldSupplyDemand {
  annualProduction: number;
  totalSupply: number;
  demandJewelry: number;
  demandInvestment: number;
  demandIndustry: number;
  demandCentralBanks: number;
}

export interface ComparisonMetrics {
  btcAsPercentOfGold: number;
  btcPricePerGoldOunce: number;
  goldOuncesPerBtc: number;
}

export interface HistoricalDataPoint {
  date: string;
  timestamp: number;
  btcPrice: number;
  goldPrice: number;
  btcMarketCap?: number;
  goldMarketCap?: number;
}

export interface PerformanceComparison {
  ytd: {
    btcReturn: number;
    goldReturn: number;
  };
  oneYear: {
    btcReturn: number;
    goldReturn: number;
  };
  fiveYear?: {
    btcReturn: number;
    goldReturn: number;
  };
}

export interface VolatilityMetrics {
  btc30dVolatility: number;
  gold30dVolatility: number;
  btc90dVolatility: number;
  gold90dVolatility: number;
}

export interface ApiResponse {
  bitcoin: {
    price: number;
    marketCap: number;
    blockchainStats?: BlockchainStats;
    pricePerformance?: PricePerformance;
  };
  gold: {
    price: number;
    marketCap: number;
    pricePerformance?: PricePerformance;
    supplyDemand?: GoldSupplyDemand;
  };
  comparison?: ComparisonMetrics;
  performanceComparison?: PerformanceComparison;
  volatilityMetrics?: VolatilityMetrics;
  historicalData?: HistoricalDataPoint[];
  lastUpdated: string;
}

export interface CoinGeckoResponse {
  bitcoin: BitcoinData;
}

export interface MetalsApiResponse {
  success: boolean;
  rates: {
    XAU: number; // Gold price in USD per troy ounce
  };
}
