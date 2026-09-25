import { Entity } from "./core";
import { ensureMesaEstado, ensureNif, ensureNonEmpty } from "./utils";

interface MesaProps extends Record<string, unknown> {
  nifEmpresa: string;
  mesaId: string;
  salaId: string;
  nomeMesa: string;
  estado: string;
  obs: string;
}

const editability: Record<keyof MesaProps, boolean> = {
  nifEmpresa: false,
  mesaId: false,
  salaId: false,
  nomeMesa: true,
  estado: true,
  obs: true,
};

export class Mesa extends Entity<MesaProps> {
  private constructor(props: MesaProps) {
    super(props, editability);
  }

  private static build(props: MesaProps): Mesa {
    ensureNonEmpty(props.mesaId, "ID da mesa");
    ensureNonEmpty(props.salaId, "ID da sala");
    ensureNif(props.nifEmpresa, "NIF da empresa");
    ensureNonEmpty(props.nomeMesa, "Nome da mesa");
    ensureMesaEstado(props.estado);
    return new Mesa(props);
  }

  public static new(
    nifEmpresa: string,
    mesaId: string,
    salaId: string,
    nomeMesa: string,
  ): Mesa {
    return this.build({
      nifEmpresa,
      mesaId,
      salaId,
      nomeMesa,
      estado: "livre",
      obs: "",
    });
  }

  public static rebuild(props: MesaProps): Mesa {
    return this.build(props);
  }

  public set(key: string, value: unknown): void {
    if (key === "nomeMesa" && typeof value === "string") {
      ensureNonEmpty(value, "Nome da mesa");
    }
    if (key === "estado" && typeof value === "string") {
      ensureMesaEstado(value);
    }
    this.set_prop(key, value);
  }
}
