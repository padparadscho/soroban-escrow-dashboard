// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use server';

import { getDashboardData } from '@/lib/services';
import type {
  DashboardData,
  DashboardQueryParams,
  TimeRange,
} from '@/lib/types';

/**
 * Fetches full dashboard data for given query parameters
 * @param params Query parameters (range, page, pageSize)
 * @returns Full dashboard data (chart, summary, events)
 */
export async function fetchDashboard(
  params: DashboardQueryParams,
): Promise<DashboardData> {
  return getDashboardData(params);
}

/**
 * Fetches chart data for a given time range
 * @param range Time range for the chart
 * @returns Partial dashboard data (chart)
 */
export async function fetchChart(
  range: TimeRange,
): Promise<Pick<DashboardData, 'chart'>> {
  const data = await getDashboardData({
    range,
    page: 1,
    pageSize: 20,
  });
  return { chart: data.chart };
}
