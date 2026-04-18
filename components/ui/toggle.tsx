// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import { type ReactNode } from 'react';

export interface ToggleGroupProps {
  /** Toggle group content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface ToggleItemProps {
  /** Toggle item content */
  children: ReactNode;
  /** Whether this item is currently active */
  isActive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable toggle group container component
 * @param props {@link ToggleGroupProps}
 * @returns {ReactNode}
 */
export function ToggleGroup({
  children,
  className,
}: ToggleGroupProps): ReactNode {
  return (
    <div
      className={[
        'inline-flex rounded-md border border-border overflow-hidden',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

/**
 * Reusable toggle item component
 * @param props {@link ToggleItemProps}
 * @returns {ReactNode}
 */
export function ToggleItem({
  children,
  isActive,
  onClick,
  className,
}: ToggleItemProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'cursor-pointer border-r border-border px-3 py-1 text-xs whitespace-nowrap last:border-r-0 font-medium transition-colors duration-150',
        isActive
          ? 'bg-secondary font-semibold text-foreground'
          : 'text-muted-foreground hover:bg-accent',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
