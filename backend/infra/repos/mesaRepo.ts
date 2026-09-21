import { injectable } from "tsyringe";
import { IMesaRepo, Mesa } from "../../domain";
import { DatabaseContext, mesaSchema } from "../mysql";
import { count, and, eq } from "drizzle-orm";

@injectable()
export class MesaRepo implements IMesaRepo {
  public readonly db;

  public constructor(private readonly databaseContext: DatabaseContext) {
    this.db = databaseContext.db;
  }
  async count(salaId: string): Promise<number> {
    try {
      const [row] = await this.db
        .select({ value: count() })
        .from(mesaSchema)
        .where(eq(mesaSchema.salaId, salaId));
      return row?.value ?? 0;
    } catch (error) {
      throw new Error("Erro ao contar mesas!");
    }
  }
  async list(salaId: string): Promise<Mesa[]> {
    try {
      const rows = await this.db
        .select()
        .from(mesaSchema)
        .where(eq(mesaSchema.salaId, salaId));

      return rows.map((row) =>
        Mesa.fromPersistence(row.mesaId, {
          salaId: row.salaId,
          identificador: row.nomeMesa,
          estado: row.estado,
          obs: row.obs,
        }),
      );
    } catch (error) {
      throw new Error("Erro ao listar mesas!");
    }
  }

  async load(mesaId: string): Promise<Mesa> {
    try {
      const [row] = await this.db
        .select()
        .from(mesaSchema)
        .where(eq(mesaSchema.mesaId, mesaId));
      if (!row) {
        throw new Error("Mesa não encontrada!");
      }
      return Mesa.fromPersistence(row.mesaId, {
        salaId: row.salaId,
        identificador: row.nomeMesa,
        estado: row.estado,
        obs: row.obs,
      });
    } catch (error) {
      throw new Error("Erro ao carregar mesa!");
    }
  }

  async store(mesa: Mesa): Promise<Mesa> {
    try {
      await this.db.insert(mesaSchema).values({
        salaId: mesa.props.salaId,
        mesaId: mesa.id,
        nomeMesa: mesa.props.identificador,
        estado: mesa.props.estado,
        obs: mesa.props.obs,
      });

      return await this.load(mesa.id);
    } catch (error) {
      throw new Error("Erro ao armazenar mesa!");
    }
  }
  async delete(mesaId: string): Promise<void> {
    try {
      await this.db.delete(mesaSchema).where(eq(mesaSchema.mesaId, mesaId));
    } catch (error) {
      throw new Error("Erro ao eliminar mesa!");
    }
  }
}
