import { inject, injectable } from "tsyringe";
import { IMesaRepo, Mesa } from "../../domain";
import {
  artigoSchema,
  contaSchema,
  DatabaseContext,
  mesaSchema,
} from "../database/mysql";
import { and, count, eq, inArray } from "drizzle-orm";
import { rethrowOrWrap } from "./utils";
import { NotFoundError } from "../../shared/errors";

@injectable()
export class MesaRepo implements IMesaRepo {
  public readonly db;

  public constructor(
    @inject(DatabaseContext) private readonly databaseContext: DatabaseContext,
  ) {
    this.db = databaseContext.db;
  }

  async count(nifEmpresa: string, salaId: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(mesaSchema)
        .where(
          and(
            eq(mesaSchema.nifEmpresa, nifEmpresa),
            eq(mesaSchema.salaId, salaId),
          ),
        );
      return row?.value ?? 0;
    } catch (err) {
      rethrowOrWrap(err, "Erro ao contar mesas!");
    }
  }

  async list(nifEmpresa: string, salaId: string): Promise<Mesa[]> {
    try {
      const rows = await this.db
        .select()
        .from(mesaSchema)
        .where(
          and(
            eq(mesaSchema.nifEmpresa, nifEmpresa),
            eq(mesaSchema.salaId, salaId),
          ),
        );

      return rows.map((row) =>
        Mesa.rebuild({
          nifEmpresa: row.nifEmpresa,
          mesaId: row.mesaId,
          salaId: row.salaId,
          nomeMesa: row.nomeMesa,
          estado: row.estado,
          obs: row.obs,
        }),
      );
    } catch (err) {
      rethrowOrWrap(err, "Erro ao listar mesas!");
    }
  }

  async load(
    nifEmpresa: string,
    salaId: string,
    mesaId: string,
  ): Promise<Mesa> {
    try {
      const [row] = await this.db
        .select()
        .from(mesaSchema)
        .where(
          and(
            eq(mesaSchema.nifEmpresa, nifEmpresa),
            eq(mesaSchema.salaId, salaId),
            eq(mesaSchema.mesaId, mesaId),
          ),
        );
      if (!row) {
        throw new NotFoundError("Mesa não encontrada!");
      }
      return Mesa.rebuild({
        nifEmpresa: row.nifEmpresa,
        mesaId: row.mesaId,
        salaId: row.salaId,
        nomeMesa: row.nomeMesa,
        estado: row.estado,
        obs: row.obs,
      });
    } catch (err) {
      rethrowOrWrap(err, "Erro ao carregar mesa!");
    }
  }

  async store(nifEmpresa: string, mesa: Mesa): Promise<Mesa> {
    try {
      const [existing] = await this.db
        .select({ mesaId: mesaSchema.mesaId })
        .from(mesaSchema)
        .where(
          and(
            eq(mesaSchema.nifEmpresa, nifEmpresa),
            eq(mesaSchema.salaId, mesa.props.salaId),
            eq(mesaSchema.mesaId, mesa.props.mesaId),
          ),
        );

      if (!existing) {
        await this.db.insert(mesaSchema).values({
          nifEmpresa: nifEmpresa,
          salaId: mesa.props.salaId,
          mesaId: mesa.props.mesaId,
          nomeMesa: mesa.props.nomeMesa,
          estado: mesa.props.estado,
          obs: mesa.props.obs,
        });
      } else {
        await this.db
          .update(mesaSchema)
          .set({
            nomeMesa: mesa.props.nomeMesa,
            estado: mesa.props.estado,
            obs: mesa.props.obs,
          })
          .where(
            and(
              eq(mesaSchema.nifEmpresa, nifEmpresa),
              eq(mesaSchema.salaId, mesa.props.salaId),
              eq(mesaSchema.mesaId, mesa.props.mesaId),
            ),
          );
      }

      return await this.load(nifEmpresa, mesa.props.salaId, mesa.props.mesaId);
    } catch (err) {
      rethrowOrWrap(err, "Erro ao armazenar mesa!");
    }
  }

  async delete(
    nifEmpresa: string,
    salaId: string,
    mesaId: string,
  ): Promise<void> {
    try {
      await this.db.transaction(async (tx) => {
        const contas = await tx
          .select({ contaId: contaSchema.contaId })
          .from(contaSchema)
          .where(
            and(
              eq(contaSchema.nifEmpresa, nifEmpresa),
              eq(contaSchema.mesaId, mesaId),
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
              eq(mesaSchema.mesaId, mesaId),
            ),
          );
      });
    } catch (err) {
      rethrowOrWrap(err, "Erro ao eliminar mesa!");
    }
  }
}
