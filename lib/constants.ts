// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { PageSize, TimeRange } from '@/lib/types';

/** Default time range for charts */
export const DEFAULT_CHART_RANGE = '1y' as const;

/** Available time ranges for charts */
export const AVAILABLE_CHART_RANGES: { key: TimeRange; label: string }[] = [
  { key: '30d', label: '30 DAYS' },
  { key: '90d', label: '90 DAYS' },
  { key: '1y', label: '1 YEAR' },
];

/** Available page sizes for events pagination */
export const AVAILABLE_PAGE_SIZES = [
  20, 50, 100,
] as const satisfies readonly PageSize[];
