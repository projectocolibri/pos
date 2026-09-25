import { Entity } from "./core";
import { ensureNif, ensureNonEmpty } from "./utils";

interface SalaProps extends Record<string, unknown> {
  nifEmpresa: string;
  salaId: string;
  nome: string;
}

const editability: Record<keyof SalaProps, boolean> = {
  nifEmpresa: false,
  salaId: false,
  nome: true,
};

export class Sala extends Entity<SalaProps> {
  private constructor(props: SalaProps) {
    super(props, editability);
  }

  private static build(props: SalaProps): Sala {
    ensureNonEmpty(props.salaId, "ID da sala");
    ensureNif(props.nifEmpresa, "NIF da empresa");
    ensureNonEmpty(props.nome, "Nome da sala");
    return new Sala(props);
  }

  public static new(salaId: string, nifEmpresa: string, nome: string): Sala {
    return this.build({
      salaId,
      nifEmpresa,
      nome,
    });
  }

  public static rebuild(props: SalaProps): Sala {
    return this.build(props);
  }

  public set(key: string, value: unknown): void {
    if (key === "nome" && typeof value === "string") {
      ensureNonEmpty(value, "Nome da sala");
    }
    this.set_prop(key, value);
  }
}
