// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export type BadgeVariant =
  | 'default'
  | 'lock'
  | 'unlock'
  | 'transfer'
  | 'memo'
  | 'claim';

export interface BadgeProps {
  /** Badge content */
  children: ReactNode;
  /** Visual style variant
   * @default 'default'
   */
  variant?: BadgeVariant;
  /** Optional icon */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default:
    'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  lock: 'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  unlock:
    'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  transfer:
    'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  memo: 'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  claim:
    'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
} satisfies Record<BadgeVariant, string>;

/**
 * Reusable badge component
 * @param props {@link BadgeProps}
 * @returns {ReactNode}
 */
export function Badge({
  variant = 'default',
  icon,
  children,
  className,
}: BadgeProps): ReactNode {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md border px-2 py-0.5 align-middle',
        VARIANT_STYLES[variant],
        className ?? '',
      ].join(' ')}
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span
        className={[
          'text-[0.625rem] font-semibold uppercase tracking-[0.06em] leading-none translate-y-[0.5px]',
        ].join(' ')}
      >
        {children}
      </span>
    </span>
  );
}
