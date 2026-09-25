import { inject, injectable } from "tsyringe";
import { Artigo, Conta, IContaRepo } from "../../domain";
import { artigoSchema, contaSchema, DatabaseContext } from "../database/mysql";
import { and, count, eq, inArray, notInArray } from "drizzle-orm";
import { rethrowOrWrap } from "./utils";
import { NotFoundError } from "../../shared/errors";

@injectable()
export class ContaRepo implements IContaRepo {
  public readonly db;

  public constructor(
    @inject(DatabaseContext) private readonly databaseContext: DatabaseContext,
  ) {
    this.db = databaseContext.db;
  }

  async count(nifEmpresa: string, mesaId: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(contaSchema)
        .where(
          and(
            eq(contaSchema.nifEmpresa, nifEmpresa),
            eq(contaSchema.mesaId, mesaId),
          ),
        );
      return row?.value ?? 0;
    } catch (err) {
      rethrowOrWrap(err, "Erro ao contar contas!");
    }
  }

  async list(nifEmpresa: string, mesaId: string): Promise<Conta[]> {
    try {
      const rows = await this.db
        .select()
        .from(contaSchema)
        .where(
          and(
            eq(contaSchema.nifEmpresa, nifEmpresa),
            eq(contaSchema.mesaId, mesaId),
          ),
        );

      if (rows.length === 0) {
        return [];
      }

      const artigosByContaId = await this.list_artigos_by_conta_ids(
        nifEmpresa,
        rows.map((row) => row.contaId),
      );

      return rows.map((row) =>
        Conta.rebuild({
          nifEmpresa: row.nifEmpresa,
          contaId: row.contaId,
          mesaId: row.mesaId,
          entidade: row.entidade,
          nome: row.nome,
          morada: row.morada,
          codigoPostal: row.codigoPostal,
          localidade: row.localidade,
          nif: row.nif,
          artigos: artigosByContaId.get(row.contaId) ?? [],
        }),
      );
    } catch (err) {
      rethrowOrWrap(err, "Erro ao listar contas!");
    }
  }

  async load(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
  ): Promise<Conta> {
    try {
      const [row] = await this.db
        .select()
        .from(contaSchema)
        .where(
          and(
            eq(contaSchema.nifEmpresa, nifEmpresa),
            eq(contaSchema.mesaId, mesaId),
            eq(contaSchema.contaId, contaId),
          ),
        );
      if (!row) {
        throw new NotFoundError("Conta não encontrada!");
      }
      return Conta.rebuild({
        nifEmpresa: row.nifEmpresa,
        contaId: row.contaId,
        mesaId: row.mesaId,
        entidade: row.entidade,
        nome: row.nome,
        morada: row.morada,
        codigoPostal: row.codigoPostal,
        localidade: row.localidade,
        nif: row.nif,
        artigos: await this.list_artigos(row.nifEmpresa, row.contaId),
      });
    } catch (err) {
      rethrowOrWrap(err, "Erro ao carregar conta!");
    }
  }

  async store(nifEmpresa: string, conta: Conta): Promise<Conta> {
    try {
      await this.db.transaction(async (tx) => {
        const [existing] = await tx
          .select({ contaId: contaSchema.contaId })
          .from(contaSchema)
          .where(
            and(
              eq(contaSchema.nifEmpresa, nifEmpresa),
              eq(contaSchema.mesaId, conta.props.mesaId),
              eq(contaSchema.contaId, conta.props.contaId),
            ),
          );

        const values = {
          nifEmpresa: nifEmpresa,
          mesaId: conta.props.mesaId,
          contaId: conta.props.contaId,
          entidade: conta.props.entidade,
          nome: conta.props.nome,
          morada: conta.props.morada,
          codigoPostal: conta.props.codigoPostal,
          localidade: conta.props.localidade,
          nif: conta.props.nif,
        };

        if (!existing) {
          await tx.insert(contaSchema).values(values);
        } else {
          await tx
            .update(contaSchema)
            .set({
              entidade: values.entidade,
              nome: values.nome,
              morada: values.morada,
              codigoPostal: values.codigoPostal,
              localidade: values.localidade,
              nif: values.nif,
            })
            .where(
              and(
                eq(contaSchema.nifEmpresa, nifEmpresa),
                eq(contaSchema.mesaId, conta.props.mesaId),
                eq(contaSchema.contaId, conta.props.contaId),
              ),
            );
        }

        const artigos = conta.getArtigos();
        const codigoArtigos = artigos.map(
          (artigo) => artigo.props.codigoArtigo,
        );

        const existingArtigos = await tx
          .select({
            codigoArtigo: artigoSchema.codigoArtigo,
            quantidade: artigoSchema.quantidade,
            desconto: artigoSchema.desconto,
          })
          .from(artigoSchema)
          .where(
            and(
              eq(artigoSchema.nifEmpresa, nifEmpresa),
              eq(artigoSchema.contaId, conta.props.contaId),
            ),
          );

        const existingByCodigo = new Map(
          existingArtigos.map((row) => [row.codigoArtigo, row]),
        );

        const toInsert = [];
        for (const artigo of artigos) {
          const existingArtigo = existingByCodigo.get(
            artigo.props.codigoArtigo,
          );
          if (!existingArtigo) {
            toInsert.push({
              nifEmpresa: nifEmpresa,
              contaId: artigo.props.contaId,
              codigoArtigo: artigo.props.codigoArtigo,
              quantidade: artigo.props.quantidade,
              desconto: artigo.props.desconto,
            });
            continue;
          }
          if (
            existingArtigo.quantidade !== artigo.props.quantidade ||
            existingArtigo.desconto !== artigo.props.desconto
          ) {
            await tx
              .update(artigoSchema)
              .set({
                quantidade: artigo.props.quantidade,
                desconto: artigo.props.desconto,
              })
              .where(
                and(
                  eq(artigoSchema.nifEmpresa, nifEmpresa),
                  eq(artigoSchema.contaId, artigo.props.contaId),
                  eq(artigoSchema.codigoArtigo, artigo.props.codigoArtigo),
                ),
              );
          }
        }

        if (toInsert.length > 0) {
          await tx.insert(artigoSchema).values(toInsert);
        }

        if (codigoArtigos.length === 0) {
          await tx
            .delete(artigoSchema)
            .where(
              and(
                eq(artigoSchema.nifEmpresa, nifEmpresa),
                eq(artigoSchema.contaId, conta.props.contaId),
              ),
            );
        } else {
          await tx
            .delete(artigoSchema)
            .where(
              and(
                eq(artigoSchema.nifEmpresa, nifEmpresa),
                eq(artigoSchema.contaId, conta.props.contaId),
                notInArray(artigoSchema.codigoArtigo, codigoArtigos),
              ),
            );
        }
      });

      return await this.load(
        nifEmpresa,
        conta.props.mesaId,
        conta.props.contaId,
      );
    } catch (err) {
      rethrowOrWrap(err, "Erro ao armazenar conta!");
    }
  }

  async delete(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
  ): Promise<void> {
    try {
      await this.db.transaction(async (tx) => {
        await tx
          .delete(artigoSchema)
          .where(
            and(
              eq(artigoSchema.nifEmpresa, nifEmpresa),
              eq(artigoSchema.contaId, contaId),
            ),
          );
        await tx
          .delete(contaSchema)
          .where(
            and(
              eq(contaSchema.nifEmpresa, nifEmpresa),
              eq(contaSchema.mesaId, mesaId),
              eq(contaSchema.contaId, contaId),
            ),
          );
      });
    } catch (err) {
      rethrowOrWrap(err, "Erro ao eliminar conta!");
    }
  }

  private async list_artigos(
    nifEmpresa: string,
    contaId: string,
  ): Promise<Artigo[]> {
    try {
      const rows = await this.db
        .select()
        .from(artigoSchema)
        .where(
          and(
            eq(artigoSchema.nifEmpresa, nifEmpresa),
            eq(artigoSchema.contaId, contaId),
          ),
        );
      return rows.map((row) =>
        Artigo.rebuild({
          nifEmpresa: row.nifEmpresa,
          contaId: row.contaId,
          codigoArtigo: row.codigoArtigo,
          quantidade: row.quantidade,
          desconto: row.desconto,
        }),
      );
    } catch (err) {
      rethrowOrWrap(err, "Erro ao listar artigos!");
    }
  }

  private async list_artigos_by_conta_ids(
    nifEmpresa: string,
    contaIds: string[],
  ): Promise<Map<string, Artigo[]>> {
    const rows = await this.db
      .select()
      .from(artigoSchema)
      .where(
        and(
          eq(artigoSchema.nifEmpresa, nifEmpresa),
          inArray(artigoSchema.contaId, contaIds),
        ),
      );

    const byContaId = new Map<string, Artigo[]>();
    for (const row of rows) {
      const artigos = byContaId.get(row.contaId) ?? [];
      artigos.push(
        Artigo.rebuild({
          nifEmpresa: row.nifEmpresa,
          contaId: row.contaId,
          codigoArtigo: row.codigoArtigo,
          quantidade: row.quantidade,
          desconto: row.desconto,
        }),
      );
      byContaId.set(row.contaId, artigos);
    }
    return byContaId;
  }
}
