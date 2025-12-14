export interface BitcoinData {
  usd: number;
  usd_market_cap: number;
}

export interface GoldData {
  price: number;
}

export interface MarketCapData {
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
  color: string;
}

export interface BlockchainStats {
  totalSupply: number;
  blockHeight: number;
  hashRate: number; // Hash rate in EH/s (exahashes per second)
  timeSinceGenesis: {
    years: number;
    months: number;
    days: number;
  };
}

export interface ApiResponse {
  bitcoin: {
    price: number;
    marketCap: number;
    blockchainStats?: BlockchainStats;
  };
  gold: {
    price: number;
    marketCap: number;
  };
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
