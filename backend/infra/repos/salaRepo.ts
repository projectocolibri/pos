import { ISalaRepo, Sala } from "../../domain";
import { DatabaseContext } from "../mysql";
import { injectable } from "tsyringe";
import { salaSchema } from "../mysql";
import { eq, count, and } from "drizzle-orm";

@injectable()
export class SalaRepo implements ISalaRepo {
  public readonly db;

  public constructor(private readonly databaseContext: DatabaseContext) {
    this.db = databaseContext.db;
  }
  async count(nifEmpresa: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(salaSchema)
        .where(eq(salaSchema.nifEmpresa, nifEmpresa));
      return row?.value ?? 0;
    } catch (error) {
      throw new Error("Erro ao contar salas!");
    }
  }

  async list(nifEmpresa: string): Promise<Sala[]> {
    try {
      const rows = await this.db
        .select()
        .from(salaSchema)
        .where(eq(salaSchema.nifEmpresa, nifEmpresa));

      return rows.map((row) =>
        Sala.fromPersistence(row.salaId, {
          nifEmpresa: row.nifEmpresa,
          nome: row.nomeSala ?? "",
        }),
      );
    } catch (error) {
      throw new Error("Erro ao listar salas!");
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
        throw new Error("Sala não encontrada!");
      }
      return Sala.fromPersistence(row.salaId, {
        nifEmpresa: row.nifEmpresa,
        nome: row.nomeSala,
      });
    } catch (error) {
      throw new Error("Erro ao carregar sala!");
    }
  }

  async store(sala: Sala): Promise<Sala> {
    try {
      await this.db.insert(salaSchema).values({
        nifEmpresa: sala.props.nifEmpresa,
        salaId: sala.id,
        nomeSala: sala.props.nome,
      });

      return await this.load(sala.props.nifEmpresa, sala.id);
    } catch (error) {
      throw new Error("Erro ao armazenar sala!");
    }
  }

  async delete(nifEmpresa: string, salaId: string): Promise<void> {
    try {
      await this.db
        .delete(salaSchema)
        .where(
          and(
            eq(salaSchema.nifEmpresa, nifEmpresa),
            eq(salaSchema.salaId, salaId),
          ),
        );
    } catch (error) {
      throw new Error("Erro ao eliminar sala!");
    }
  }
}
