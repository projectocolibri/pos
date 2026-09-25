import { inject, injectable } from "tsyringe";
import { ISalaRepo, Sala } from "../../domain";
import {
  artigoSchema,
  contaSchema,
  DatabaseContext,
  mesaSchema,
  salaSchema,
} from "../database/mysql";
import { and, count, eq, inArray } from "drizzle-orm";
import { rethrowOrWrap } from "./utils";
import { NotFoundError } from "../../shared/errors";

@injectable()
export class SalaRepo implements ISalaRepo {
  public readonly db;

  public constructor(
    @inject(DatabaseContext) private readonly databaseContext: DatabaseContext,
  ) {
    this.db = databaseContext.db;
  }

  async count(nifEmpresa: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(salaSchema)
        .where(eq(salaSchema.nifEmpresa, nifEmpresa));
      return row?.value ?? 0;
    } catch (err) {
      rethrowOrWrap(err, "Erro ao contar salas!");
    }
  }

  async list(nifEmpresa: string): Promise<Sala[]> {
    try {
      const rows = await this.db
        .select()
        .from(salaSchema)
        .where(eq(salaSchema.nifEmpresa, nifEmpresa));

      return rows.map((row) =>
        Sala.rebuild({
          salaId: row.salaId,
          nifEmpresa: row.nifEmpresa,
          nome: row.nomeSala ?? "",
        }),
      );
    } catch (err) {
      rethrowOrWrap(err, "Erro ao listar salas!");
    }
  }

  async load(nifEmpresa: string, salaId: string): Promise<Sala> {
    try {
      const [row] = await this.db
        .select()
        .from(salaSchema)
        .where(
          and(
            eq(salaSchema.nifEmpresa, nifEmpresa),
            eq(salaSchema.salaId, salaId),
          ),
        );
      if (!row) {
        throw new NotFoundError("Sala não encontrada!");
      }
      return Sala.rebuild({
        salaId: row.salaId,
        nifEmpresa: row.nifEmpresa,
        nome: row.nomeSala,
      });
    } catch (err) {
      rethrowOrWrap(err, "Erro ao carregar sala!");
    }
  }

  async store(sala: Sala): Promise<Sala> {
    try {
      const [existing] = await this.db
        .select({ salaId: salaSchema.salaId })
        .from(salaSchema)
        .where(
          and(
            eq(salaSchema.nifEmpresa, sala.props.nifEmpresa),
            eq(salaSchema.salaId, sala.props.salaId),
          ),
        );

      if (!existing) {
        await this.db.insert(salaSchema).values({
          nifEmpresa: sala.props.nifEmpresa,
          salaId: sala.props.salaId,
          nomeSala: sala.props.nome,
        });
      } else {
        await this.db
          .update(salaSchema)
          .set({ nomeSala: sala.props.nome })
          .where(
            and(
              eq(salaSchema.nifEmpresa, sala.props.nifEmpresa),
              eq(salaSchema.salaId, sala.props.salaId),
            ),
          );
      }

      return await this.load(sala.props.nifEmpresa, sala.props.salaId);
    } catch (err) {
      rethrowOrWrap(err, "Erro ao armazenar sala!");
    }
  }

  async delete(nifEmpresa: string, salaId: string): Promise<void> {
    try {
      await this.db.transaction(async (tx) => {
        const mesas = await tx
          .select({ mesaId: mesaSchema.mesaId })
          .from(mesaSchema)
          .where(
            and(
              eq(mesaSchema.nifEmpresa, nifEmpresa),
              eq(mesaSchema.salaId, salaId),
            ),
          );
        const mesaIds = mesas.map((mesa) => mesa.mesaId);

        if (mesaIds.length > 0) {
          const contas = await tx
            .select({ contaId: contaSchema.contaId })
            .from(contaSchema)
            .where(
              and(
                eq(contaSchema.nifEmpresa, nifEmpresa),
                inArray(contaSchema.mesaId, mesaIds),
              ),
            );
          const contaIds = contas.map((conta) => conta.contaId);

          if (contaIds.length > 0) {
            await tx
              .delete(artigoSchema)
              .where(
                and(
                  eq(artigoSchema.nifEmpresa, nifEmpresa),
                  inArray(artigoSchema.contaId, contaIds),
                ),
              );
            await tx
              .delete(contaSchema)
              .where(
                and(
                  eq(contaSchema.nifEmpresa, nifEmpresa),
                  inArray(contaSchema.contaId, contaIds),
                ),
              );
          }

          await tx
            .delete(mesaSchema)
            .where(
              and(
                eq(mesaSchema.nifEmpresa, nifEmpresa),
                eq(mesaSchema.salaId, salaId),
              ),
            );
        }

        await tx
          .delete(salaSchema)
          .where(
            and(
              eq(salaSchema.nifEmpresa, nifEmpresa),
              eq(salaSchema.salaId, salaId),
            ),
          );
      });
    } catch (err) {
      rethrowOrWrap(err, "Erro ao eliminar sala!");
    }
  }
}
