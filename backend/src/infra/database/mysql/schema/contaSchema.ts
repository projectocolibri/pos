import {
  foreignKey,
  index,
  int,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";
import { mesaSchema } from "./mesaSchema";

export const contaSchema = mysqlTable(
  "conta",
  {
    nifEmpresa: varchar("nifEmpresa", { length: 9 }).notNull(),
    mesaId: varchar("mesaId", { length: 36 }).notNull(),
    contaId: varchar("contaId", { length: 36 }).notNull(),
    entidade: int("entidade").notNull(),
    nome: varchar("nome", { length: 100 }).notNull(),
    morada: varchar("morada", { length: 255 }).notNull(),
    codigoPostal: varchar("codigoPostal", { length: 8 }).notNull(),
    localidade: varchar("localidade", { length: 100 }).notNull(),
    nif: varchar("nif", { length: 9 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "pk_conta",
      columns: [table.nifEmpresa, table.contaId],
    }),
    index("idx_conta_nifEmpresa_mesaId").on(table.nifEmpresa, table.mesaId),
    foreignKey({
      name: "fk_conta_mesa",
      columns: [table.nifEmpresa, table.mesaId],
      foreignColumns: [mesaSchema.nifEmpresa, mesaSchema.mesaId],
    }),
  ],
);
