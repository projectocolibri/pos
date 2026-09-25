import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { MySql2Database } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

/**
 * Applies Drizzle migrations from dist/migrations (beside the bundle).
 */
export async function applyMigrations(
  db: MySql2Database<Record<string, unknown>>,
): Promise<void> {
  const migrationsFolder = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "migrations",
  );
  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");

  if (!fs.existsSync(journalPath)) {
    throw new Error(`Jornal de migração não encontrado em ${journalPath}!`);
  }

  await migrate(db, { migrationsFolder });
}
