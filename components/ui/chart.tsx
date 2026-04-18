// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: Need to fix the range behavior so the X-axis always displays the full period even when no data exists for it

'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Chart as ChartJS, TimeScale } from 'chart.js';
import { registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(...registerables, TimeScale);

export interface ChartDataPoint {
  /** X-axis value (timestamp) */
  x: number;
  /** Y-axis value (balance) */
  y: number;
  /** Event type (lock/unlock) */
  event?: 'lock' | 'unlock';
}

export interface ChartProps {
  /** Data points to plot */
  data: ChartDataPoint[];
  /** Chart line and points color */
  accentColor: string;
  /** Chart axes color */
  axisColor: string;
  /** Chart grid color */
  gridColor?: string;
  /** Tooltip background color */
  tooltipBackground?: string;
  /** Tooltip text color */
  tooltipText?: string;
  /** Function to format Y-axis tick values */
  valueTick?: (value: number) => string;
  /** Message to display when there is no data */
  emptyMessage?: string;
}

/**
 * Reusable chart component
 * @param props {@link ChartProps}
 * @returns {ReactNode}
 */
export function Chart({
  data,
  accentColor,
  axisColor,
  gridColor,
  tooltipBackground,
  tooltipText,
  valueTick,
  emptyMessage = 'No data for this period',
}: ChartProps): ReactNode {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (data.length === 0) return;

    const context = chartRef.current.getContext('2d');
    if (!context) return;

    const gradient = context.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, `${accentColor}40`);
    gradient.addColorStop(1, `${accentColor}00`);

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    chartInstance.current = new ChartJS(context, {
      type: 'line',
      data: {
        datasets: [
          {
            data: data,
            clip: false,
            borderColor: accentColor,
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: accentColor,
            pointHoverBorderColor: 'oklch(1 0 0)',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: tooltipBackground,
            titleColor: tooltipText,
            bodyColor: tooltipText,
            borderColor: 'transparent',
            borderWidth: 0,
            cornerRadius: 6,
            caretSize: 0,
            caretPadding: 8,
            padding: { x: 8, y: 4 },
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            displayColors: false,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: { day: 'MMM d' },
            },
            grid: { display: false },
            border: { display: true, color: axisColor },
            ticks: {
              color: axisColor,
              font: { size: 10 },
              source: 'data',
              major: { enabled: true },
            },
          },
          y: {
            type: 'linear',
            min: 0,
            grid: { color: gridColor ?? 'oklch(0.92 0 0)' },
            border: { display: false },
            ticks: {
              color: axisColor,
              font: { size: 10 },
              callback: (val) => valueTick?.(val as number) ?? String(val),
            },
          },
        },
        interaction: { mode: 'nearest', intersect: false },
        spanGaps: true,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [
    data,
    accentColor,
    axisColor,
    gridColor,
    tooltipBackground,
    tooltipText,
    valueTick,
  ]);

  if (data.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-30 w-full overflow-hidden">
      <canvas ref={chartRef} className="w-full! h-full!" />
    </div>
  );
}
