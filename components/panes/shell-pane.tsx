// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { variants } from '@/lib/motion/variants';
import { Button } from '@/components/ui/button';
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
    <motion.section
      variants={variants}
      initial={false}
      animate={expanded ? 'expanded' : dimmed ? 'dimmed' : 'collapsed'}
      layout
      transition={{
        layout: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
        scale: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      style={gridArea ? { gridArea } : undefined}
      className={[
        'grid min-h-0 grid-rows-[auto_1fr] rounded-md border border-border bg-pane shadow-sm overflow-hidden',
        expanded ? 'fixed inset-4 z-50' : 'relative z-1',
      ].join(' ')}
    >
      <header className="flex min-h-10 items-center justify-between gap-2 border-b border-border px-3">
        <h2 className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {title}
        </h2>
        {expandable && (
          <Button
            onClick={onExpandToggle}
            aria-label={
              expanded ? `Collapse ${title} pane` : `Expand ${title} pane`
            }
            className="shrink-0 justify-center p-0! size-6! border-transparent! bg-transparent! transition-[border-color,background,color] duration-150 ease-out hover:bg-accent!"
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
          </Button>
        )}
      </header>
      <div className={['flex flex-col min-h-0 p-2 overflow-hidden'].join(' ')}>
        {children}
      </div>
    </motion.section>
  );
}
