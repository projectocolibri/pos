import {
  foreignKey,
  int,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";
import { contaSchema } from "./conta.schema";

export const artigoSchema = mysqlTable(
  "artigo",
  {
    contaId: varchar("contaId", { length: 36 }).notNull(),
    codigoArtigo: varchar("codigoArtigo", { length: 50 }).notNull(),
    quantidade: int("quantidade").notNull(),
    desconto: int("desconto").notNull(),
  },
  (table) => [
    primaryKey({
      name: "pk_artigo",
      columns: [table.contaId, table.codigoArtigo],
    }),
    foreignKey({
      name: "fk_artigo_conta",
      columns: [table.contaId],
      foreignColumns: [contaSchema.contaId],
    }),
  ],
);
