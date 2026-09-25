import { Entity } from "./core";
import {
  ensureBiggerThanZero,
  ensureNif,
  ensureNonEmpty,
  ensurePositive,
} from "./utils";

interface ArtigoProps extends Record<string, unknown> {
  nifEmpresa: string;
  contaId: string;
  codigoArtigo: string;
  quantidade: number;
  desconto: number;
}

const editability: Record<keyof ArtigoProps, boolean> = {
  nifEmpresa: false,
  contaId: false,
  codigoArtigo: false,
  quantidade: true,
  desconto: true,
};

export class Artigo extends Entity<ArtigoProps> {
  private constructor(props: ArtigoProps) {
    super(props, editability);
  }

  private static build(props: ArtigoProps): Artigo {
    ensureNif(props.nifEmpresa, "NIF da empresa");
    ensureNonEmpty(props.contaId, "ID da conta");
    ensureNonEmpty(props.codigoArtigo, "Código do artigo");
    ensureBiggerThanZero(props.quantidade, "Quantidade do artigo");
    ensurePositive(props.desconto, "Desconto do artigo");
    return new Artigo(props);
  }

  public static new(
    nifEmpresa: string,
    contaId: string,
    codigoArtigo: string,
  ): Artigo {
    return this.build({
      nifEmpresa,
      contaId,
      codigoArtigo,
      quantidade: 1,
      desconto: 0,
    });
  }

  public static rebuild(props: ArtigoProps): Artigo {
    return this.build(props);
  }

  public set(key: string, value: unknown): void {
    if (key === "quantidade" && typeof value === "number") {
      ensureBiggerThanZero(value, "Quantidade do artigo");
    }
    if (key === "desconto" && typeof value === "number") {
      ensurePositive(value, "Desconto do artigo");
    }
    this.set_prop(key, value);
  }
}
