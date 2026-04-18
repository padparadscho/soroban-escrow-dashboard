// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { db } from './database';

/**
 * Fetches chart event rows within a date range
 * @param startDate Start date for the range
 * @returns An array of chart event rows
 */
export async function getChartRows(startDate: Date) {
  return db
    .selectFrom('events')
    .select(['id', 'topics', 'escrow_balance', 'ledger_closed_at'])
    .where('processed', '=', true)
    .where('ledger_closed_at', '>=', startDate)
    .where('ledger_closed_at', 'is not', null)
    .where('escrow_balance', 'is not', null)
    .orderBy('ledger_closed_at', 'asc')
    .orderBy('id', 'asc')
    .execute();
}

/**
 * Lists paginated events and transfers
 * @param limit Number of rows to fetch
 * @param offset Number of rows to skip for pagination
 * @returns A sorted array of event and transfer rows
 */
export async function getEventsRows({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  const events = await db
    .selectFrom('events')
    .select([
      'events.id',
      'events.topics',
      'events.data',
      'events.ledger_closed_at',
      'events.transaction_hash',
      'events.unit_price',
    ])
    .where('processed', '=', true)
    .where('ledger_closed_at', 'is not', null)
    .orderBy('ledger_closed_at', 'desc')
    .limit(limit)
    .offset(offset)
    .execute();

  const transfers = await db
    .selectFrom('transfers')
    .select([
      'transfers.id',
      'transfers.amount',
      'transfers.sender',
      'transfers.recipient',
      'transfers.ledger_closed_at',
      'transfers.transaction_hash',
      'transfers.unit_price',
    ])
    .leftJoin('memos', 'memos.transaction_hash', 'transfers.transaction_hash')
    .select(['memos.memo'])
    .where('transfers.processed', '=', true)
    .where('transfers.ledger_closed_at', 'is not', null)
    .orderBy('transfers.ledger_closed_at', 'desc')
    .limit(limit)
    .offset(offset)
    .execute();

  return [
    ...events.map((e) => ({
      id: e.id,
      sourceType: 'event' as const,
      topics: e.topics,
      data: e.data,
      unitPrice: e.unit_price,
      amount: null,
      sender: null,
      recipient: null,
      ledgerClosedAt: e.ledger_closed_at,
      txHash: e.transaction_hash,
      memo: null,
    })),
    ...transfers.map((t) => ({
      id: t.id,
      sourceType: 'transfer' as const,
      topics: null,
      data: null,
      unitPrice: t.unit_price,
      amount: t.amount,
      sender: t.sender,
      recipient: t.recipient,
      ledgerClosedAt: t.ledger_closed_at,
      txHash: t.transaction_hash,
      memo: t.memo,
    })),
  ]
    .sort(
      (a, b) =>
        (b.ledgerClosedAt?.getTime() ?? 0) - (a.ledgerClosedAt?.getTime() ?? 0),
    )
    .slice(0, limit);
}

/**
 * Counts total processed events and transfers
 * @returns The total count
 */
export async function getEventsCount(): Promise<number> {
  const eventsCount = await db
    .selectFrom('events')
    .select((eb) => eb.fn.count('id').as('count'))
    .where('processed', '=', true)
    .executeTakeFirst();

  const transfersCount = await db
    .selectFrom('transfers')
    .select((eb) => eb.fn.count('id').as('count'))
    .where('processed', '=', true)
    .executeTakeFirst();

  return Number(eventsCount?.count || 0) + Number(transfersCount?.count || 0);
}

/**
 * Returns latest escrow balance
 * @returns The latest escrow balance
 */
export async function getEscrowBalance() {
  const escrowBalance = await db
    .selectFrom('events')
    .select(['escrow_balance'])
    .where('processed', '=', true)
    .where('escrow_balance', 'is not', null)
    .orderBy('ledger_closed_at', 'desc')
    .orderBy('id', 'desc')
    .limit(1)
    .executeTakeFirst();

  return escrowBalance?.escrow_balance || null;
}
