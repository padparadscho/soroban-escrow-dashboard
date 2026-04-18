// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Formats a Stellar address
 * @param address Full Stellar address
 * @returns Shortened address
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Formats a raw amount for display
 * @param amount Raw amount as a string
 * @returns Localized formatted amount string
 */
export function formatAmount(amount: string): string {
  const rawAmount = BigInt(amount);
  const divisor = BigInt(10_000_000); // 10^7 for 7 decimal places

  const value = rawAmount / divisor;
  return value.toLocaleString();
}

/**
 * Formats a numeric value into a string with suffixes
 * @param value Numeric value to format
 * @returns Formatted string with appropriate suffix
 */
export function formatValue(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;

  return value.toLocaleString();
}

/**
 * Formats a raw amount into USD using the provided unit price
 * @param amount Raw amount as a string
 * @param unitPrice Price per unit in USD as a string
 * @returns Formatted USD string
 */
export function formatPrice(amount: string, unitPrice: string): string {
  const units = Number(BigInt(amount)) / 10_000_000;
  const price = units * Number(unitPrice);

  if (price >= 1_000_000_000) return `$${(price / 1_000_000_000).toFixed(2)}B`;
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(2)}K`;

  return `$${price.toFixed(2)}`;
}

/**
 * Formats a numeric value into a string with specified decimal places
 * @param value Raw value as a string
 * @param decimals Number of decimal places to display
 * @returns Formatted string with specified decimal places
 */
export function formatDecimals(value: string, decimals: number = 6): string {
  return Number(value).toFixed(decimals);
}

/**
 * Formats a Unix timestamp to a localized date+time string in UTC
 * @param date Unix timestamp (in milliseconds)
 * @returns Formatted date+time string
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
}
