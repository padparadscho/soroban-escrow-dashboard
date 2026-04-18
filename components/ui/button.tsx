// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable button component
 * @param props {@link ButtonProps}
 * @returns {ReactNode}
 */
export function Button({
  children,
  className,
  ...rest
}: ButtonProps): ReactNode {
  return (
    <button
      type="button"
      className={[
        'inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors',
        rest.disabled
          ? 'pointer-events-none opacity-35'
          : 'hover:bg-accent hover:border-input hover:text-accent-foreground',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
