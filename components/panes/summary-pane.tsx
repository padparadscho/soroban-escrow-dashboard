// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: Harcoded total escrows value for simplicity, expected to be replaced anytime soon

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { SummaryData } from '@/lib/types';
import { formatAddress, formatAmount } from '@/lib/utils';
import { staggerChildren, staggerParent } from '@/lib/motion/variants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Identicon } from '@/components/ui/identicon';
import { Tooltip } from '@/components/ui/tooltip';
import { Scrolling } from '@/components/ui/scrolling';
import { InfoIcon } from '@/components/icons/info';
import { GitHubIcon } from '@/components/icons/github';
import { NotifierIcon } from '@/components/icons/notifier';

export interface SummaryPaneProps {
  /** Summary data to display in the pane */
  summary: SummaryData;
  /** Stellar explorer URL */
  explorer: string;
  /** GitHub repository URL */
  repository: string;
  /** Notifier Twitter URL */
  notifier: string;
}

/**
 * Summary pane component
 * @param props {@link SummaryPaneProps}
 * @returns {ReactNode}
 */
export function SummaryPane({
  summary,
  explorer,
  repository,
  notifier,
}: SummaryPaneProps): ReactNode {
  const escrowContractUrl = `${explorer}/contract/${summary.escrowContractAddress}`;
  const assetContractUrl = `${explorer}/contract/${summary.assetContractAddress}`;

  return (
    <div className="flex flex-1 flex-col gap-3.5 min-h-0 overflow-hidden">
      {/* Stats */}
      <Scrolling className="grid grid-cols-2 gap-2 sm:gap-3">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="contents"
        >
          <Card
            className="flex min-h-0 flex-col hover:bg-muted transition-colors duration-150"
            variants={staggerChildren}
          >
            <CardHeader className="px-2.5 sm:px-3 pt-2 sm:pt-2.5">
              <CardTitle className="text-[0.625rem] sm:text-[0.6875rem]">
                Escrowed Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2.5 sm:px-3 py-1.5 sm:py-2">
              <span className="font-mono text-[0.9375rem] sm:text-[1.0625rem] font-semibold leading-tight tabular-nums text-foreground">
                {summary.escrowAmount
                  ? formatAmount(summary.escrowAmount)
                  : '—'}
              </span>
            </CardContent>
          </Card>
          <Card
            className="flex min-h-0 flex-col hover:bg-muted transition-colors duration-150"
            variants={staggerChildren}
          >
            <CardHeader className="px-2.5 sm:px-3 pt-2 sm:pt-2.5">
              <CardTitle className="text-[0.625rem] sm:text-[0.6875rem]">
                Escrowed Value
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2.5 sm:px-3 py-1.5 sm:py-2">
              <span className="font-mono text-[0.9375rem] sm:text-[1.0625rem] font-semibold leading-tight tabular-nums text-foreground">
                {summary.escrowPrice
                  ? `$${Number(summary.escrowPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </span>
            </CardContent>
          </Card>
          <Card
            className="flex min-h-0 flex-col hover:bg-muted transition-colors duration-150"
            variants={staggerChildren}
          >
            <CardHeader className="px-2.5 sm:px-3 pt-2 sm:pt-2.5">
              <CardTitle className="text-[0.625rem] sm:text-[0.6875rem]">
                Unit Price
              </CardTitle>
              <Tooltip content={'Current DEX price.'}>
                <InfoIcon className="size-3.5 fill-current text-muted-foreground" />
              </Tooltip>
            </CardHeader>
            <CardContent className="px-2.5 sm:px-3 py-1.5 sm:py-2">
              <span className="font-mono text-[0.9375rem] sm:text-[1.0625rem] font-semibold leading-tight tabular-nums text-foreground">
                {summary.unitPrice
                  ? `$${Number(summary.unitPrice).toFixed(4)}`
                  : '—'}
              </span>
            </CardContent>
          </Card>
          <Card
            className="flex min-h-0 flex-col hover:bg-muted transition-colors duration-150"
            variants={staggerChildren}
          >
            <CardHeader className="px-2.5 sm:px-3 pt-2 sm:pt-2.5">
              <CardTitle className="text-[0.625rem] sm:text-[0.6875rem]">
                Total Escrows
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2.5 sm:px-3 py-1.5 sm:py-2">
              <span className="font-mono text-[0.9375rem] sm:text-[1.0625rem] font-semibold leading-tight tabular-nums text-foreground">
                60
              </span>
            </CardContent>
          </Card>
          <Card
            className="flex min-h-0 flex-col hover:bg-muted transition-colors duration-150"
            variants={staggerChildren}
          >
            <CardHeader className="px-2.5 sm:px-3 pt-2 sm:pt-2.5">
              <CardTitle className="text-[0.625rem] sm:text-[0.6875rem]">
                Escrow Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2.5 sm:px-3 py-1.5 sm:py-2">
              <a
                href={escrowContractUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-muted-foreground underline"
              >
                <Identicon address={summary.escrowContractAddress} size={16} />
                {formatAddress(summary.escrowContractAddress)}
              </a>
            </CardContent>
          </Card>
          <Card
            className="flex min-h-0 flex-col hover:bg-muted transition-colors duration-150"
            variants={staggerChildren}
          >
            <CardHeader className="px-2.5 sm:px-3 pt-2 sm:pt-2.5">
              <CardTitle className="text-[0.625rem] sm:text-[0.6875rem]">
                Asset Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2.5 sm:px-3 py-1.5 sm:py-2">
              <a
                href={assetContractUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-muted-foreground underline"
              >
                <Identicon address={summary.assetContractAddress} size={16} />
                {formatAddress(summary.assetContractAddress)}
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </Scrolling>

      {/* Footer */}
      <div className="mt-auto flex flex-col sm:flex-row sm:justify-between items-center gap-2 mb-1.5">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mx-1">
          <a
            href={repository}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <GitHubIcon className="size-4 fill-current" />
            <span>Repository</span>
          </a>
          <a
            href={notifier}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <NotifierIcon className="size-4 fill-current" />
            <span>Notifier on Twitter</span>
          </a>
        </div>
        <span className="whitespace-nowrap mx-1 text-[0.6875rem] text-muted-foreground">
          © 2026, Padparadscho
        </span>
      </div>
    </div>
  );
}
