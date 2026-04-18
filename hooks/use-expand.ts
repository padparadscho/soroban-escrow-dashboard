// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import { useState, useCallback } from 'react';

/**
 * Manage expanded state for panes
 * @param initial Initial pane key to expand, or null for none
 * @returns Expanded pane key and toggle function
 */
export function useExpand<PaneKey extends string>(
  initial: PaneKey | null = null,
) {
  const [expanded, setExpanded] = useState<PaneKey | null>(initial);

  const toggle = useCallback((pane: PaneKey) => {
    setExpanded((previous) => (previous === pane ? null : pane));
  }, []);

  return { expanded, toggle };
}
