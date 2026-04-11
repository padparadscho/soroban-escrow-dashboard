// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { Migrator, FileMigrationProvider } from "kysely";
import { db } from "./database";
import path from "path";
import fs from "fs/promises";

const migrationFolder = path.join(__dirname, "migrations");

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({ fs, path, migrationFolder }),
});

/**
 * - "latest" (default): run all pending migrations up
 * - "down": rollback the last migration
 * - "list": show migration status
 */
const option = process.env.MIGRATE_OPTION ?? "latest";

async function run() {
  if (option === "list") {
    const migrations = await migrator.getMigrations();

    for (const migration of migrations) {
      console.log(
        `${migration.name} - ${migration.executedAt ? "executed" : "pending"}`,
      );
    }
    await db.destroy();
    return;
  }

  const result = await (option === "latest"
    ? migrator.migrateToLatest()
    : migrator.migrateDown());

  for (const migration of result.results ?? []) {
    console.log(
      `${migration.direction}: ${migration.migrationName} - ${migration.status}`,
    );
  }

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  await db.destroy();
}

void run();
