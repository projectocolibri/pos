import {
  foreignKey,
  index,
  int,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import { mesaSchema } from "./mesa.schema";

export const contaSchema = mysqlTable(
  "conta",
  {
    mesaId: varchar("mesaId", { length: 36 }).notNull(),
    contaId: varchar("contaId", { length: 36 }).primaryKey(),
    entidade: int("entidade").notNull(),
    nome: varchar("nome", { length: 100 }).notNull(),
    morada: varchar("morada", { length: 255 }).notNull(),
    codigoPostal: varchar("codigoPostal", { length: 8 }).notNull(),
    localidade: varchar("localidade", { length: 100 }).notNull(),
    nif: varchar("nif", { length: 9 }).notNull(),
  },
  (table) => [
    index("idx_conta_id_mesa").on(table.mesaId),
    foreignKey({
      name: "fk_conta_mesa",
      columns: [table.mesaId],
      foreignColumns: [mesaSchema.mesaId],
    }),
  ],
);
