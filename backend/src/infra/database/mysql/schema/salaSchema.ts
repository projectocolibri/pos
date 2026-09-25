import {
  mysqlTable,
  varchar,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/mysql-core";

export const salaSchema = mysqlTable(
  "sala",
  {
    nifEmpresa: varchar("nifEmpresa", { length: 9 }).notNull(),
    salaId: varchar("salaId", { length: 36 }).notNull(),
    nomeSala: varchar("nomeSala", { length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "pk_sala",
      columns: [table.nifEmpresa, table.salaId],
    }),
    uniqueIndex("uk_sala_nifEmpresa_nomeSala").on(
      table.nifEmpresa,
      table.nomeSala,
    ),
  ],
);
