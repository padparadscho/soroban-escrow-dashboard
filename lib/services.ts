// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import {
  getChartRows,
  getEventsCount,
  getEventsRows,
  getEscrowBalance,
} from '@/lib/database/queries';
import type {
  DashboardData,
  DashboardQueryParams,
  PageSize,
  TimeRange,
} from '@/lib/types';
import { CONFIG } from '@/lib/config';

/**
 * Parses the event from a given topics JSON string
 * @param topicsJson The topics JSON string to parse
 * @returns The parsed event, or null if not found
 */
function parseTopicEvent(topicsJson: string | null): 'lock' | 'unlock' | null {
  if (!topicsJson) return null;
  if (topicsJson.includes('unlock')) return 'unlock';
  if (topicsJson.includes('lock')) return 'lock';
  return null;
}

/**
 * Parses the address from a given topics JSON string
 * @param topicsJson The topics JSON string to parse
 * @returns The parsed address, or an empty string if not found
 */
function parseTopicAddress(topicsJson: string | null): string {
  if (!topicsJson) return '';
  try {
    const parsed = JSON.parse(topicsJson);
    if (Array.isArray(parsed) && parsed.length > 2) {
      const value = parsed[2];
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        if (typeof obj.address === 'string') return obj.address;
      }
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Parses the amount from a given data JSON string
 * @param dataJson The data JSON string to parse
 * @returns The parsed amount, or null if not found
 */
function parseDataAmount(dataJson: string | null): string | null {
  if (!dataJson) return null;
  try {
    const parsed = JSON.parse(dataJson);
    if (typeof parsed === 'object' && parsed !== null) {
      const map = Array.isArray(parsed) ? parsed : (parsed.map ?? []);
      const entry = (
        map as {
          key?: { symbol?: string; sym?: string };
          val?: { i128?: string; u64?: string };
        }[]
      ).find((e) => e.key?.symbol === 'amount' || e.key?.sym === 'amount');
      return entry?.val?.i128 ?? entry?.val?.u64 ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Parses the claim_after date from a given data JSON string
 * @param dataJson The data JSON string to parse
 * @returns The parsed claim_after date, or null if not found
 */
function parseDataClaimAfter(dataJson: string | null): Date | null {
  if (!dataJson) return null;
  try {
    const parsed = JSON.parse(dataJson);
    if (typeof parsed === 'object' && parsed !== null) {
      const map = Array.isArray(parsed) ? parsed : (parsed.map ?? []);
      const entry = (
        map as {
          key?: { symbol?: string; sym?: string };
          val?: { i128?: string; u64?: string; i64?: string };
        }[]
      ).find(
        (e) => e.key?.symbol === 'claim_after' || e.key?.sym === 'claim_after',
      );
      if (!entry) return null;
      const raw = entry.val?.i128 ?? entry.val?.u64 ?? entry.val?.i64;
      if (raw == null) return null;
      const secs =
        typeof raw === 'string'
          ? Number(raw.split(',')[0] ?? raw)
          : Number(raw);
      return Number.isFinite(secs) ? new Date(secs * 1000) : null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Normalizes a given page size value to a valid PageSize
 * @param value The page size value to normalize
 * @returns A valid PageSize value, or the default if the input is invalid
 */
export function normalizePageSize(value: number): PageSize {
  const sizes = [20, 50, 100] as const;
  if (sizes.includes(value as PageSize)) return value as PageSize;
  return sizes[0];
}

/**
 * Normalizes a given page value to a valid page number
 * @param value The page value to normalize
 * @returns A valid page number, or 1 if the input is invalid
 */
export function normalizePage(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

/**
 * Calculates the start date for a given time range
 * @param range The time range to calculate the start date for
 * @param now The current date and time, defaults to the current date and time
 * @returns The start date for the given time range
 */
export function getRangeStart(range: TimeRange, now = new Date()): Date {
  const start = new Date(now);
  if (range === '30d') {
    start.setUTCDate(start.getUTCDate() - 30);
    return start;
  }
  if (range === '90d') {
    start.setUTCDate(start.getUTCDate() - 90);
    return start;
  }
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  return start;
}

/**
 * Get the current unit price of the asset from the Stellar Expert API
 * @returns The unit price, or null if it cannot be retrieved
 */
export async function getUnitPrice(): Promise<string | null> {
  if (!CONFIG.STELLAR_ASSET_ID) return null;
  try {
    const res = await fetch(
      `${CONFIG.STELLAR_EXPERT_BASE_URL}/asset/${CONFIG.STELLAR_ASSET_ID}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const payload = (await res.json()) as { price?: unknown };
    return typeof payload.price === 'number' ? String(payload.price) : null;
  } catch {
    return null;
  }
}

/**
 * Calculates the escrow price based on the raw amount and unit price
 * @param rawAmount The raw amount in the smallest unit
 * @param unitPrice The unit price of the asset
 * @returns The calculated escrow price, or null if the input values are invalid
 */
export function getEscrowPrice(
  rawAmount: string | null,
  unitPrice: string | null,
): string | null {
  if (!rawAmount || !unitPrice) return null;
  const units = Number(rawAmount) / 10 ** 7;
  const price = Number(unitPrice);
  if (!Number.isFinite(units) || !Number.isFinite(price)) return null;
  return String(units * price);
}

/**
 * Fetches the dashboard data based on the provided query parameters
 * @param params {@link DashboardQueryParams}
 * @returns Resolves to {@link DashboardData}
 */
export async function getDashboardData(
  params: DashboardQueryParams,
): Promise<DashboardData> {
  const pageSize = normalizePageSize(params.pageSize);
  const page = normalizePage(params.page);
  const offset = (page - 1) * pageSize;
  const [chartRows, eventsRows, totalItems, escrowBalance, unitPrice] =
    await Promise.all([
      getChartRows(getRangeStart(params.range)),
      getEventsRows({ limit: pageSize, offset }),
      getEventsCount(),
      getEscrowBalance(),
      getUnitPrice(),
    ]);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    chart: chartRows.map((row) => ({
      id: row.id,
      date: row.ledger_closed_at!,
      balance: row.escrow_balance!,
      event: parseTopicEvent(row.topics) ?? 'unlock',
    })),

    summary: {
      escrowContractAddress: CONFIG.SOROBAN_ESCROW_CONTRACT_ID,
      assetContractAddress: CONFIG.STELLAR_ASSET_CONTRACT_ID,
      unitPrice: unitPrice,
      escrowAmount: escrowBalance,
      escrowPrice: getEscrowPrice(escrowBalance, unitPrice),
    },

    events: {
      items: eventsRows.map((row) => ({
        id: row.id,
        type:
          row.sourceType === 'transfer'
            ? 'transfer'
            : (parseTopicEvent(row.topics) ?? 'unlock'),
        address:
          row.sourceType === 'transfer'
            ? (row.sender ?? '')
            : parseTopicAddress(row.topics),
        unitPrice: row.unitPrice,
        amount:
          row.sourceType === 'transfer'
            ? (row.amount ?? '0')
            : (parseDataAmount(row.data) ?? '0'),
        date: row.ledgerClosedAt!,
        claimAfter:
          row.sourceType === 'event' ? parseDataClaimAfter(row.data) : null,
        recipient: row.recipient,
        memo: row.memo,
        txHash: row.txHash,
      })),
      meta: { page, pageSize, totalItems, totalPages },
    },
  };
}
