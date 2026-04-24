// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import { useSyncExternalStore } from 'react';

/**
 * Media query matching mobile viewport
 * (!) First iteration
 */
const MOBILE_MEDIA_QUERY = '(max-width: 1023px) AND (orientation: portrait)';

/**
 * Subscribe to viewport width changes
 * @param callback Callback to invoke on viewport width change
 * @returns Unsubscribe function
 */
function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

/**
 * Get current viewport width state
 * @returns {boolean} `true` if mobile (<1024px or <768px) and vice versa, `false` otherwise
 */
function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
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
