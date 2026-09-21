import { AggregateRoot } from "../../core";
import { Artigo } from "./artigo";
import {
  ensureEditable,
  ensureNonEmpty,
  ensurePositive,
} from "./utils/validation";

interface ContaProps {
  mesaId: string;
  entidade: number;
  nome: string;
  morada: string;
  codigoPostal: string;
  localidade: string;
  nif: string;
  artigos: Artigo[];
}

const editability = {
  mesaId: false,
  entidade: true,
  nome: true,
  morada: true,
  codigoPostal: true,
  localidade: true,
  nif: true,
  artigos: false,
};

export class Conta extends AggregateRoot<ContaProps> {
  private constructor(id: string, props: ContaProps) {
    super(id, props);
  }

  private static create(id: string, props: ContaProps): Conta {
    ensureNonEmpty(props.mesaId, "ID da mesa");
    ensurePositive(props.entidade, "Entidade");
    return new Conta(id, props);
  }

  public static new(id: string, mesaId: string): Conta {
    return this.create(id, {
      mesaId,
      entidade: 0,
      nome: "",
      morada: "",
      codigoPostal: "",
      localidade: "",
      nif: "",
      artigos: [],
    });
  }

  public static fromPersistence(id: string, props: ContaProps): Conta {
    return this.create(id, props);
  }

  public addArtigo(codigo: string): void {
    this.props.artigos.push(Artigo.new(codigo));
  }

  public removeArtigo(artigo: Artigo): void {
    this.props.artigos.splice(this.props.artigos.indexOf(artigo), 1);
  }

  public set(key: keyof ContaProps, value: ContaProps[keyof ContaProps]): void {
    ensureEditable(editability[key], key);
    this.assign(key, value);
  }
}
