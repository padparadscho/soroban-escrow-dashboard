// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: Fallback needs some refinement

'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { generateIdenticon } from '@/lib/stellar/identicon';

export interface IdenticonProps {
  /** Stellar public address */
  address: string;
  /** Size in pixels
   * @default 32
   */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable identicon fallback component
 * @param props {@link IdenticonProps}
 * @returns {ReactNode}
 */
export function IdenticonFallback({
  address,
  size = 32,
  className,
}: IdenticonProps): ReactNode {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full text-[0.35em] font-medium font-mono',
        className ?? '',
      ].join(' ')}
      style={{ width: size, height: size }}
    >
      {address.slice(0, 4)}
    </span>
  );
}

/**
 * Reusable identicon component
 * @param props {@link IdenticonProps}
 * @returns {ReactNode}
 */
export function Identicon({
  address,
  size = 32,
  className,
}: IdenticonProps): ReactNode {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(generateIdenticon(address, size));
  }, [address, size]);

  if (!src) {
    return (
      <IdenticonFallback address={address} size={size} className={className} />
    );
  }

  /* eslint-disable @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={`Identicon for ${address.slice(0, 4)}...${address.slice(-4)}`}
      width={size}
      height={size}
      className={['inline-block shrink-0 rounded-full', className ?? ''].join(
        ' ',
      )}
    />
  );
}
