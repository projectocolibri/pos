import { AggregateRoot } from "../../core";
import { ensureNonEmpty, ensureEditable } from "./utils/validation";

interface SalaProps {
  nifEmpresa: string;
  nome: string;
}

const editability = {
  nifEmpresa: false,
  nome: true,
};

export class Sala extends AggregateRoot<SalaProps> {
  private constructor(id: string, props: SalaProps) {
    super(id, props);
  }

  private static create(id: string, props: SalaProps): Sala {
    ensureNonEmpty(props.nifEmpresa, "NIF da empresa");
    return new Sala(id, props);
  }

  public static new(id: string, nifEmpresa: string): Sala {
    return this.create(id, {
      nifEmpresa: nifEmpresa,
      nome: "",
    });
  }

  public static fromPersistence(id: string, props: SalaProps): Sala {
    return this.create(id, props);
  }

  public set(key: keyof SalaProps, value: SalaProps[keyof SalaProps]): void {
    ensureEditable(editability[key], key);
    this.assign(key, value);
  }
}
