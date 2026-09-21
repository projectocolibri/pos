import {
  foreignKey,
  mysqlTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { salaSchema } from "./sala.schema";

export const mesaSchema = mysqlTable(
  "mesa",
  {
    salaId: varchar("salaId", { length: 36 }).notNull(),
    mesaId: varchar("mesaId", { length: 36 }).primaryKey(),
    nomeMesa: varchar("nomeMesa", { length: 32 }).notNull(),
    estado: varchar("estado", { length: 20 }).notNull(),
    obs: varchar("obs", { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex("uk_mesa_sala_identificador").on(table.salaId, table.nomeMesa),
    foreignKey({
      name: "fk_mesa_sala",
      columns: [table.salaId],
      foreignColumns: [salaSchema.salaId],
    }),
  ],
);
