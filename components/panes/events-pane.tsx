// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import type { ReactNode } from 'react';
import NextImage from 'next/image';
import type { EventsData, PageSize } from '@/lib/types';
import { staggerChildren, staggerParent } from '@/lib/motion/variants';
import { AVAILABLE_PAGE_SIZES } from '@/lib/constants';
import {
  formatAddress,
  formatAmount,
  formatDate,
  formatDecimals,
  formatPrice,
} from '@/lib/utils';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Scrolling } from '@/components/ui/scrolling';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Identicon } from '@/components/ui/identicon';
import { ToggleGroup, ToggleItem } from '@/components/ui/toggle';
import { LinkIcon } from '@/components/icons/link';
import { DotIcon } from '@/components/icons/dot';

export interface EventsPaneProps {
  /** Events data to display in the pane */
  events: EventsData;
  /** Stellar explorer URL */
  explorer: string;
  /** Skeleton placeholder */
  loading?: boolean;
  /** Callback for page changes */
  onPageChange: (page: number) => void;
  /** Callback for page size changes */
  onPageSizeChange: (pageSize: PageSize) => void;
}

/**
 * Events pane component
 * @param props {@link EventsPaneProps}
 * @returns {ReactNode}
 */
export function EventsPane({
  events,
  explorer,
  loading,
  onPageChange,
  onPageSizeChange,
}: EventsPaneProps): ReactNode {
  const { items, meta } = events;
  const isPrevDisabled = meta.page <= 1;
  const isNextDisabled = meta.page >= meta.totalPages;

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-1.5">
        <ToggleGroup>
          {AVAILABLE_PAGE_SIZES.map((size) => (
            <ToggleItem
              key={size}
              isActive={meta.pageSize === size}
              onClick={() => onPageSizeChange(size)}
            >
              {size}
            </ToggleItem>
          ))}
        </ToggleGroup>
        <span className="flex h-full select-none items-center px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase">
          items per page
        </span>
        <span className="ml-auto pr-4 text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">
          <span className="font-mono">{meta.totalItems.toLocaleString()}</span>{' '}
          events
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <Scrolling className="flex-1 min-h-0">
          <Table>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrolling>
      ) : items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
          No events found
        </div>
      ) : (
        <Scrolling className="flex-1 min-h-0">
          <Table>
            <TableBody
              variants={staggerParent}
              initial="hidden"
              animate="show"
              motionKey={meta.page}
            >
              {items.map((item) => {
                const isTransfer = item.type === 'transfer';
                const isLock = item.type === 'lock';
                return (
                  <TableRow
                    key={item.id}
                    motionKey={item.id}
                    variants={staggerChildren}
                  >
                    <TableCell>
                      <Badge
                        variant={item.type}
                        icon={
                          item.type === 'lock' ? (
                            <DotIcon className="size-2.5 gap-2 fill-green-500" />
                          ) : item.type === 'unlock' ? (
                            <DotIcon className="size-2.5 gap-2 fill-purple-500" />
                          ) : item.type === 'transfer' ? (
                            <DotIcon className="size-2.5 gap-2 fill-blue-500" />
                          ) : undefined
                        }
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`${explorer}/account/${item.address}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-muted-foreground underline"
                      >
                        <Identicon address={item.address} size={14} />
                        {formatAddress(item.address)}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {
                          {
                            lock: 'locked',
                            unlock: 'unlocked',
                            transfer: 'sent',
                          }[item.type]
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex whitespace-nowrap items-center gap-1">
                        <span className="font-mono text-sm tabular-nums text-foreground font-semibold">
                          {formatAmount(item.amount)}
                        </span>
                        <NextImage
                          src="/stronghold-logo.svg"
                          alt=""
                          width={14}
                          height={14}
                          className="shrink-0"
                          loading="eager"
                        />
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.unitPrice && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <span>
                            ~ {formatPrice(item.amount, item.unitPrice)}
                          </span>
                          <span className="text-[0.625rem] leading-none opacity-75">
                            /${formatDecimals(item.unitPrice)}
                          </span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(isTransfer && item.recipient) ||
                      (isLock && item.claimAfter) ? (
                        <span className="text-xs text-muted-foreground">
                          {isTransfer ? 'to' : 'until'}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {isTransfer && item.recipient && (
                        <a
                          href={`${explorer}/account/${item.recipient}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 font-mono text-foreground hover:text-muted-foreground underline"
                        >
                          <Identicon address={item.recipient} size={14} />
                          {formatAddress(item.recipient)}
                        </a>
                      )}
                      {isLock && item.claimAfter && (
                        <Badge variant="claim">
                          {formatDate(item.claimAfter)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isTransfer && item.memo && (
                        <span className="text-xs text-muted-foreground">
                          with memo
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isTransfer && item.memo && (
                        <Badge variant="memo">{item.memo}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="w-full" />
                    <TableCell>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {formatDate(item.date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.txHash ? (
                        <a
                          href={`${explorer}/tx/${item.txHash}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
                          aria-label="View transaction"
                        >
                          <LinkIcon className="size-3 fill-current" />
                        </a>
                      ) : (
                        <span
                          className="inline-block size-5"
                          aria-hidden="true"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrolling>
      )}

      {/* Pagination */}
      <div className="mt-auto">
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          onPrev={() => onPageChange(meta.page - 1)}
          onNext={() => onPageChange(meta.page + 1)}
        />
      </div>
    </div>
  );
}
