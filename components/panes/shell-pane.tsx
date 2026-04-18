// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import type { ReactNode } from 'react';
import { FullViewIcon, NormalViewIcon } from '@/components/icons/view';

export interface ShellProps {
  /** Pane title */
  title: string;
  /** Pane content */
  children: ReactNode;
  /** Whether a pane is currently expanded */
  expanded: boolean;
  /** Whether a pane is dimmed */
  dimmed: boolean;
  /** Callback to toggle expanded state */
  onExpandToggle: () => void;
  /** Whether the expand button is shown */
  expandable?: boolean;
  /** CSS grid area for the pane */
  gridArea?: string;
}

/**
 * Reusable shell pane component
 * @param props {@link ShellProps}
 * @returns {ReactNode}
 */
export function ShellPane({
  title,
  children,
  expanded,
  dimmed,
  onExpandToggle,
  expandable = true,
  gridArea,
}: ShellProps): ReactNode {
  return (
    <section
      style={gridArea ? { gridArea } : undefined}
      className={[
        expanded ? 'grid min-h-0' : 'relative z-1 grid min-h-0',
        'grid-rows-[auto_1fr]',
        'rounded-md border border-border bg-pane hover:border-accent-foreground transition-opacity duration-200',
        expanded ? 'fixed inset-2 z-50' : '',
        dimmed ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <header className="flex min-h-10 items-center justify-between gap-2 border-b border-border px-3">
        <h2 className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {title}
        </h2>
        {expandable && (
          <button
            type="button"
            onClick={onExpandToggle}
            aria-label={
              expanded ? `Collapse ${title} pane` : `Expand ${title} pane`
            }
            className={[
              'inline-flex shrink-0 cursor-pointer items-center justify-center size-6 rounded-md transition-[border-color,background,color] duration-150 ease-out hover:bg-accent',
            ].join(' ')}
          >
            {expanded ? (
              <NormalViewIcon
                className="size-4 fill-current"
                aria-hidden="true"
              />
            ) : (
              <FullViewIcon
                className="size-4 fill-current"
                aria-hidden="true"
              />
            )}
          </button>
        )}
      </header>
      <div className={['flex flex-col min-h-0 p-2 overflow-hidden'].join(' ')}>
        {children}
      </div>
    </section>
  );
}
