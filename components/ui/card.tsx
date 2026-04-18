// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable card container component
 * @param props {@link CardProps}
 * @returns {ReactNode}
 */
export function Card({ children, className }: CardProps): ReactNode {
  return (
    <div
      className={['rounded-md border border-border', className ?? ''].join(' ')}
    >
      {children}
    </div>
  );
}

/**
 * Reusable card header component
 * @param props {@link CardProps}
 * @returns {ReactNode}
 */
export function CardHeader({ children, className }: CardProps): ReactNode {
  return (
    <div
      className={[
        'flex gap-1.5 px-3 pt-2.5 pb-0 items-center',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

/**
 * Reusable card title component
 * @param props {@link CardProps}
 * @returns {ReactNode}
 */
export function CardTitle({ children, className }: CardProps): ReactNode {
  return (
    <h3
      className={[
        'text-[0.6875rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </h3>
  );
}

/**
 * Reusable card content component
 * @param props {@link CardProps}
 * @returns {ReactNode}
 */
export function CardContent({ children, className }: CardProps): ReactNode {
  return (
    <div className={['px-3 py-2', className ?? ''].join(' ')}>{children}</div>
  );
}
