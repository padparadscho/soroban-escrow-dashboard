// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowIcon } from '@/components/icons/arrow';

export interface PaginationProps {
  /** Current page number */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether the previous button is disabled */
  isPrevDisabled: boolean;
  /** Whether the next button is disabled */
  isNextDisabled: boolean;
  /** Callback when previous page is clicked */
  onPrev: () => void;
  /** Callback when next page is clicked */
  onNext: () => void;
}

/**
 * Reusable pagination component
 * @param props {@link PaginationProps}
 * @returns {ReactNode}
 */
export function Pagination({
  page,
  totalPages,
  isPrevDisabled,
  isNextDisabled,
  onPrev,
  onNext,
}: PaginationProps): ReactNode {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <Button onClick={onPrev} disabled={isPrevDisabled}>
        <ArrowIcon className="size-3 rotate-180 fill-current" />
        Previous
      </Button>

      <span className="text-xs text-muted-foreground">
        Page <span className="font-mono">{page}</span> /{' '}
        <span className="font-mono">{totalPages}</span>
      </span>

      <Button onClick={onNext} disabled={isNextDisabled}>
        Next
        <ArrowIcon className="size-3 fill-current" />
      </Button>
    </div>
  );
}
