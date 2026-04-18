// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import dotenv from 'dotenv';

dotenv.config();

/** Application configuration loaded from environment variables with fallback defaults */
export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL || '',

  SOROBAN_ESCROW_CONTRACT_ID: process.env.SOROBAN_ESCROW_CONTRACT_ID || '',
  STELLAR_ASSET_CONTRACT_ID: process.env.STELLAR_ASSET_CONTRACT_ID || '',
  STELLAR_ASSET_ID: process.env.STELLAR_ASSET_ID || '',

  STELLAR_EXPLORER_BASE_URL:
    process.env.STELLAR_EXPLORER_BASE_URL ||
    'https://stellar.expert/explorer/public',
  STELLAR_EXPERT_BASE_URL:
    process.env.STELLAR_EXPERT_BASE_URL ||
    'https://api.stellar.expert/explorer/public',

  DASHBOARD_REPOSITORY_URL:
    process.env.DASHBOARD_REPOSITORY_URL ||
    'https://github.com/padparadscho/soroban-escrow-dashboard',
  NOTIFIER_TWITTER_URL: process.env.NOTIFIER_TWITTER_URL || 'https://x.com',
} as const;
