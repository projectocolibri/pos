import { Artigo } from "./artigo";
import { Entity } from "./core";
import {
  ensureIsFound,
  ensureNif,
  ensureNonEmpty,
  ensurePositive,
} from "./utils";

interface ContaProps extends Record<string, unknown> {
  nifEmpresa: string;
  contaId: string;
  mesaId: string;
  entidade: number;
  nome: string;
  morada: string;
  codigoPostal: string;
  localidade: string;
  nif: string;
}

export type ContaRebuildProps = ContaProps & {
  artigos: Artigo[];
};

const editability: Record<keyof ContaProps, boolean> = {
  nifEmpresa: false,
  contaId: false,
  mesaId: false,
  entidade: true,
  nome: true,
  morada: true,
  codigoPostal: true,
  localidade: true,
  nif: true,
};

export class Conta extends Entity<ContaProps> {
  private artigos: Artigo[];

  private constructor(props: ContaProps, artigos: Artigo[]) {
    super(props, editability);
    this.artigos = artigos;
  }

  private static build(props: ContaProps, artigos: Artigo[]): Conta {
    ensureNonEmpty(props.contaId, "ID da conta");
    ensureNonEmpty(props.mesaId, "ID da mesa");
    ensureNif(props.nifEmpresa, "NIF da empresa");
    ensureNonEmpty(props.nome, "Nome da conta");
    ensurePositive(props.entidade, "Entidade");
    if (props.nif !== "") {
      ensureNif(props.nif, "NIF");
    }
    return new Conta(props, artigos);
  }

  public static new(
    nifEmpresa: string,
    contaId: string,
    mesaId: string,
    nome: string,
  ): Conta {
    return this.build(
      {
        nifEmpresa,
        contaId,
        mesaId,
        entidade: 0,
        nome,
        morada: "",
        codigoPostal: "",
        localidade: "",
        nif: "",
      },
      [],
    );
  }

  public static rebuild(props: ContaRebuildProps): Conta {
    const { artigos, ...rest } = props;
    return this.build(rest, artigos);
  }

  public addArtigo(codigoArtigo: string): void {
    const existing = this.getArtigo(codigoArtigo);
    if (existing) {
      existing.set("quantidade", existing.props.quantidade + 1);
      return;
    }
    this.artigos.push(
      Artigo.new(this._props.nifEmpresa, this._props.contaId, codigoArtigo),
    );
  }

  public removeArtigo(codigoArtigo: string): void {
    const index = this.artigos.findIndex(
      (artigo) => artigo.props.codigoArtigo === codigoArtigo,
    );
    ensureIsFound(index, "Artigo não encontrado!");
    this.artigos.splice(index, 1);
  }

  public getArtigo(codigoArtigo: string): Artigo | undefined {
    const index = this.artigos.findIndex(
      (artigo) => artigo.props.codigoArtigo === codigoArtigo,
    );
    if (index < 0) {
      return undefined;
    }
    return this.artigos[index]!;
  }

  public getArtigos(): readonly Artigo[] {
    return [...this.artigos];
  }

  public set(key: string, value: unknown): void {
    if (key === "nome" && typeof value === "string") {
      ensureNonEmpty(value, "Nome da conta");
    }
    if (key === "nif" && typeof value === "string") {
      ensureNif(value, "NIF");
    }
    this.set_prop(key, value);
  }
}
