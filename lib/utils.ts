/**
 * Format large numbers to human-readable format with suffixes (K, M, B, T)
 * @param num - The number to format
 * @param prefix - Optional prefix (e.g., "$")
 * @returns Formatted string (e.g., "$1.84T")
 */
export function formatMarketCap(num: number, prefix = "$"): string {
  if (num === 0) return `${prefix}0`;

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1e12) {
    return `${sign}${prefix}${(absNum / 1e12).toFixed(2)}T`;
  } else if (absNum >= 1e9) {
    return `${sign}${prefix}${(absNum / 1e9).toFixed(2)}B`;
  } else if (absNum >= 1e6) {
    return `${sign}${prefix}${(absNum / 1e6).toFixed(2)}M`;
  } else if (absNum >= 1e3) {
    return `${sign}${prefix}${(absNum / 1e3).toFixed(2)}K`;
  }

  return `${sign}${prefix}${absNum.toFixed(2)}`;
}

/**
 * Format price with proper decimal places
 * @param price - The price to format
 * @param prefix - Optional prefix (e.g., "$")
 * @returns Formatted price string (e.g., "$97,234.56")
 */
export function formatPrice(price: number, prefix = "$"): string {
  return `${prefix}${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Dec 12, 2025, 5:30 PM")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Calculate percentage of total
 * @param value - The value
 * @param total - The total
 * @returns Percentage string (e.g., "6.15%")
 */
export function calculatePercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(2)}%`;
}
