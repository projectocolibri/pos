import { mysqlTable, varchar, uniqueIndex } from "drizzle-orm/mysql-core";

export const salaSchema = mysqlTable(
  "sala",
  {
    nifEmpresa: varchar("nifEmpresa", { length: 9 }).notNull(),
    salaId: varchar("salaId", { length: 36 }).primaryKey(),
    nomeSala: varchar("nomeSala", { length: 100 }).notNull(),
  },
  (table) => [
    uniqueIndex("uk_sala_nif_nome").on(table.nifEmpresa, table.nomeSala),
  ],
);
