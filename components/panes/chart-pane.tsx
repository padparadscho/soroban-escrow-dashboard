// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import type { ReactNode } from 'react';
import { useColors } from '@/hooks/use-colors';
import type { ChartData, TimeRange } from '@/lib/types';
import { AVAILABLE_CHART_RANGES } from '@/lib/constants';
import { formatValue } from '@/lib/utils';
import { Chart } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleItem } from '@/components/ui/toggle';

export interface ChartPaneProps {
  /** Chart data to display in the pane */
  points: ChartData[];
  /** Selected time range */
  range: TimeRange;
  /** Loading state */
  loading?: boolean;
  /** Callback for time range changes */
  onRangeChange: (range: TimeRange) => void;
}

export function ChartPane({
  points,
  range,
  loading,
  onRangeChange,
}: ChartPaneProps): ReactNode {
  const colors = useColors();

  const chartData = points.map((point) => ({
    x: point.date.getTime(),
    y: Number(point.balance) / 10 ** 7,
    event: point.event,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2.5">
      {/* Controls */}
      <div className="self-start">
        <ToggleGroup>
          {AVAILABLE_CHART_RANGES.map(({ key, label }) => (
            <ToggleItem
              key={key}
              isActive={range === key}
              onClick={() => onRangeChange(key)}
            >
              {label}
            </ToggleItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Chart */}
      {loading ? (
        <Skeleton className="w-full h-full min-h-30" />
      ) : (
        <Chart
          data={chartData}
          accentColor={colors.accent}
          axisColor={colors.axis}
          gridColor={colors.grid}
          tooltipBackground={colors.tooltipBackground}
          tooltipText={colors.tooltipText}
          valueTick={formatValue}
        />
      )}
    </div>
  );
}
