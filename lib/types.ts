// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/** Time range type for chart and dashboard queries */
export type TimeRange = '30d' | '90d' | '1y';

/** Page size type for events pagination */
export type PageSize = 20 | 50 | 100;

/** Allowed page sizes for events pagination */
export const ALLOWED_PAGE_SIZES = [
  20, 50, 100,
] as const satisfies readonly PageSize[];

/** Layout pane key types */
export type PaneKey = 'chart' | 'data' | 'events';

/** Chart pane item types */
export type ChartItemType = 'lock' | 'unlock';

/** Events pane item types */
export type EventsItemType = 'lock' | 'unlock' | 'transfer';

/** Chart data structure */
export interface ChartData {
  id: string;
  date: Date;
  balance: string;
  event: ChartItemType; // !unused
}

/** Summary data structure */
export interface SummaryData {
  escrowContractAddress: string;
  assetContractAddress: string;
  unitPrice: string | null;
  escrowAmount: string | null;
  escrowPrice: string | null;
}

/** Event item structure */
export interface EventsItem {
  id: string;
  type: EventsItemType;
  address: string;
  unitPrice: string | null;
  amount: string;
  date: Date;
  claimAfter: Date | null;
  recipient: string | null;
  memo: string | null;
  txHash: string | null;
}

/** Pagination metadata for events */
export interface EventsMeta {
  page: number;
  pageSize: PageSize;
  totalItems: number;
  totalPages: number;
}

/** Events data structure */
export interface EventsData {
  items: EventsItem[];
  meta: EventsMeta;
}

/** Dashboard data structure */
export interface DashboardData {
  chart: ChartData[];
  summary: SummaryData;
  events: EventsData;
}

/** Query parameters for dashboard fetches */
export interface DashboardQueryParams {
  range: TimeRange;
  page: number;
  pageSize: PageSize;
}
