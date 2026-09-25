import { ArtigoDTO } from "./artigoDTO";
import { DTO } from "./core";

interface ContaDTOProps extends Record<string, unknown> {
  nifEmpresa: string;
  contaId: string;
  mesaId: string;
  entidade: number;
  nome: string;
  morada: string;
  codigoPostal: string;
  localidade: string;
  nif: string;
  artigos: ArtigoDTO[];
}

export class ContaDTO extends DTO<ContaDTOProps> {
  private constructor(props: ContaDTOProps) {
    super(props);
  }

  private static build(props: ContaDTOProps): ContaDTO {
    return new ContaDTO(props);
  }

  public static create(props: ContaDTOProps): ContaDTO {
    return this.build(props);
  }
}
