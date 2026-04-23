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

export const staggerParent: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};
