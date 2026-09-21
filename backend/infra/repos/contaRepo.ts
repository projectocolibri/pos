import { Artigo, Conta, IContaRepo } from "../../domain";
import { artigoSchema, contaSchema, DatabaseContext } from "../mysql";
import { injectable } from "tsyringe";
import { and, count, eq } from "drizzle-orm";

@injectable()
export class ContaRepo implements IContaRepo {
  public readonly db;

  public constructor(private readonly databaseContext: DatabaseContext) {
    this.db = databaseContext.db;
  }

  async count_conta(mesaId: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(contaSchema)
        .where(eq(contaSchema.mesaId, mesaId));
      return row?.value ?? 0;
    } catch (error) {
      throw new Error("Erro ao contar contas!");
    }
  }
  async list_conta(mesaId: string): Promise<Conta[]> {
    try {
      const rows = await this.db
        .select()
        .from(contaSchema)
        .where(eq(contaSchema.mesaId, mesaId));
      const contas = await Promise.all(
        rows.map(async (row) =>
          Conta.fromPersistence(row.contaId, {
            mesaId: row.mesaId,
            entidade: row.entidade,
            nome: row.nome,
            morada: row.morada,
            codigoPostal: row.codigoPostal,
            localidade: row.localidade,
            nif: row.nif,
            artigos: await this.list_artigo(row.contaId),
          }),
        ),
      );
      return contas;
    } catch (error) {
      throw new Error("Erro ao listar contas!");
    }
  }

  async load_conta(contaId: string): Promise<Conta> {
    try {
      const [row] = await this.db
        .select()
        .from(contaSchema)
        .where(eq(contaSchema.contaId, contaId));
      if (!row) {
        throw new Error("Conta não encontrada!");
      }
      return Conta.fromPersistence(row.contaId, {
        mesaId: row.mesaId,
        entidade: row.entidade,
        nome: row.nome,
        morada: row.morada,
        codigoPostal: row.codigoPostal,
        localidade: row.localidade,
        nif: row.nif,
        artigos: await this.list_artigo(row.contaId),
      });
    } catch (error) {
      throw new Error("Erro ao carregar conta!");
    }
  }

  async store_conta(conta: Conta): Promise<Conta> {
    try {
      await this.db.insert(contaSchema).values({
        mesaId: conta.props.mesaId,
        contaId: conta.id,
        entidade: conta.props.entidade,
        nome: conta.props.nome,
        morada: conta.props.morada,
        codigoPostal: conta.props.codigoPostal,
        localidade: conta.props.localidade,
        nif: conta.props.nif,
      });
      return await this.load_conta(conta.id);
    } catch (error) {
      throw new Error("Erro ao armazenar conta!");
    }
  }

  async delete_conta(contaId: string): Promise<void> {
    try {
      await this.db.delete(contaSchema).where(eq(contaSchema.contaId, contaId));
    } catch (error) {
      throw new Error("Erro ao eliminar conta!");
    }
  }

  async count_artigo(contaId: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(artigoSchema)
        .where(eq(artigoSchema.contaId, contaId));
      return row?.value ?? 0;
    } catch (error) {
      throw new Error("Erro ao contar artigos!");
    }
  }

  async list_artigo(contaId: string): Promise<Artigo[]> {
    try {
      const rows = await this.db
        .select()
        .from(artigoSchema)
        .where(eq(artigoSchema.contaId, contaId));
      return rows.map((row) =>
        Artigo.fromPersistence({
          codigoArtigo: row.codigoArtigo,
          quantidade: row.quantidade,
          desconto: row.desconto,
        }),
      );
    } catch (error) {
      throw new Error("Erro ao listar artigos!");
    }
  }

  async load_artigo(codigoArtigo: string): Promise<Artigo> {
    try {
      const [row] = await this.db
        .select()
        .from(artigoSchema)
        .where(eq(artigoSchema.codigoArtigo, codigoArtigo));
      if (!row) {
        throw new Error("Artigo não encontrado!");
      }
      return Artigo.fromPersistence({
        codigoArtigo: row.codigoArtigo,
        quantidade: row.quantidade,
        desconto: row.desconto,
      });
    } catch (error) {
      throw new Error("Erro ao carregar artigo!");
    }
  }

  async store_artigo(contaId: string, artigo: Artigo): Promise<Artigo> {
    try {
      await this.db.insert(artigoSchema).values({
        contaId: contaId,
        codigoArtigo: artigo.props.codigoArtigo,
        quantidade: artigo.props.quantidade,
        desconto: artigo.props.desconto,
      });
      return this.load_artigo(artigo.props.codigoArtigo);
    } catch (error) {
      throw new Error("Erro ao armazenar artigo!");
    }
  }

  async delete_artigo(contaId: string, codigoArtigo: string): Promise<void> {
    try {
      await this.db
        .delete(artigoSchema)
        .where(
          and(
            eq(artigoSchema.contaId, contaId),
            eq(artigoSchema.codigoArtigo, codigoArtigo),
          ),
        );
    } catch (error) {
      throw new Error("Erro ao eliminar artigo!");
    }
    throw new Error("Method not implemented.");
  }
}
