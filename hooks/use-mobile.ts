// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: Currently, it is used to block the mobile device support

'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribe to viewport width changes
 * @param callback Callback to invoke on viewport width change
 * @returns Unsubscribe function
 */
function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(
    '((width < 1024px) OR (height < 768px)) AND ((width < 768px) OR (height < 1024px))',
  );
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

/**
 * Get current viewport width state
 * @returns {boolean} `true` if mobile (<1024px or <768px) and vice versa, `false` otherwise
 */
function getSnapshot(): boolean {
  return window.matchMedia(
    '((width < 1024px) OR (height < 768px)) AND ((width < 768px) OR (height < 1024px))',
  ).matches;
}

/**
 * Get server-side snapshot (no viewport access)
 * @returns {boolean} `false`
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Manage mobile viewport state
 * @returns {boolean} `true` if mobile, `false` otherwise
 */
export function useMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
