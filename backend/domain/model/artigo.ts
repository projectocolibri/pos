import { Entity } from "../../core";
import {
  ensureBiggerThanZero,
  ensureEditable,
  ensureNonEmpty,
  ensurePositive,
} from "./utils/validation";

interface ArtigoProps {
  codigoArtigo: string;
  quantidade: number;
  desconto: number;
}

const editability = {
  codigoArtigo: false,
  quantidade: true,
  desconto: true,
};

export class Artigo extends Entity<ArtigoProps> {
  private constructor(props: ArtigoProps) {
    super(props);
  }

  private static create(props: ArtigoProps): Artigo {
    ensureNonEmpty(props.codigoArtigo, "Código");
    ensureBiggerThanZero(props.quantidade, "Quantidade");
    ensurePositive(props.desconto, "Desconto");
    return new Artigo(props);
  }

  public static new(codigoArtigo: string): Artigo {
    return this.create({
      codigoArtigo,
      quantidade: 1,
      desconto: 0,
    });
  }

  public static fromPersistence(props: ArtigoProps): Artigo {
    return this.create(props);
  }

  public set(
    key: keyof ArtigoProps,
    value: ArtigoProps[keyof ArtigoProps],
  ): void {
    ensureEditable(editability[key], key);
    this.assign(key, value);
  }
}
