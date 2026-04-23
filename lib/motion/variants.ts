// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { Variants } from 'motion/react';

export const variants: Variants = {
  expanded: {
    opacity: 1,
    scale: 1,
  },
  collapsed: {
    opacity: 1,
    scale: 1,
  },
  dimmed: {
    opacity: 0.4,
    scale: 0.98,
    filter: 'blur(2px)',
    pointerEvents: 'none',
  },
};
