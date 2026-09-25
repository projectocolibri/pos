import {
  foreignKey,
  index,
  mysqlTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { salaSchema } from "./salaSchema";

export const mesaSchema = mysqlTable(
  "mesa",
  {
    nifEmpresa: varchar("nifEmpresa", { length: 9 }).notNull(),
    salaId: varchar("salaId", { length: 36 }).notNull(),
    mesaId: varchar("mesaId", { length: 36 }).notNull(),
    nomeMesa: varchar("nomeMesa", { length: 32 }).notNull(),
    estado: varchar("estado", { length: 20 }).notNull(),
    obs: varchar("obs", { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "pk_mesa",
      columns: [table.nifEmpresa, table.mesaId],
    }),
    uniqueIndex("uk_mesa_nifEmpresa_salaId_nomeMesa").on(
      table.nifEmpresa,
      table.salaId,
      table.nomeMesa,
    ),
    index("idx_mesa_nifEmpresa_salaId").on(table.nifEmpresa, table.salaId),
    foreignKey({
      name: "fk_mesa_sala",
      columns: [table.nifEmpresa, table.salaId],
      foreignColumns: [salaSchema.nifEmpresa, salaSchema.salaId],
    }),
  ],
);
