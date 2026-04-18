// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import { useEffect, useState } from 'react';

interface ChartColors {
  /** Primary accent color */
  accent: string;
  /** Axis tick color */
  axis: string;
  /** Grid line color */
  grid: string;
  /** Tooltip background color */
  tooltipBackground: string;
  /** Tooltip text color */
  tooltipText: string;
}

const COLORS: Record<'light' | 'dark', ChartColors> = {
  light: {
    accent: '#3B82F6',
    axis: '#96A1B1',
    grid: '#e5e5e5',
    tooltipBackground: '#171717',
    tooltipText: '#fafafa',
  },
  dark: {
    accent: '#60A5FA',
    axis: '#B6BFB8',
    grid: '#1a1a1a',
    tooltipBackground: '#e4e4e4',
    tooltipText: '#171717',
  },
};

/**
 * Manages chart colors based on the current color scheme
 * @returns {ChartColors}
 */
export function useColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(() => {
    if (typeof window === 'undefined') return COLORS.light;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? COLORS.dark
      : COLORS.light;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      setColors(event.matches ? COLORS.dark : COLORS.light);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return colors;
}
