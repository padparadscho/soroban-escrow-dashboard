// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import { useState, type ReactNode } from 'react';

export interface TooltipProps {
  /** Tooltip content */
  content: string;
  /** Trigger element */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable tooltip component
 * @param props {@link TooltipProps}
 * @returns {ReactNode}
 */
export function Tooltip({
  content,
  children,
  className,
}: TooltipProps): ReactNode {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={['relative inline-flex', className ?? ''].join(' ')}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <span
        role="tooltip"
        aria-hidden={!visible}
        className={[
          'absolute left-full top-1/2 z-50 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium bg-foreground text-background pointer-events-none transition-all duration-400',
          visible ? 'opacity-100 visible' : 'opacity-0 invisible',
        ].join(' ')}
      >
        {content}
      </span>
    </span>
  );
}
