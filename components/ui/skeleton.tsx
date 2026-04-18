// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable skeleton component
 * @param props {@link SkeletonProps}
 * @returns {ReactNode}
 */
export function Skeleton({ className }: SkeletonProps): ReactNode {
  return (
    <div
      className={[
        'rounded-md bg-secondary animate-pulse',
        className ?? '',
      ].join(' ')}
    />
  );
}
