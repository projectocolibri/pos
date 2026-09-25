import { DTO } from "./core";

interface ArtigoDTOProps extends Record<string, unknown> {
  nifEmpresa: string;
  contaId: string;
  codigoArtigo: string;
  quantidade: number;
  desconto: number;
}

export class ArtigoDTO extends DTO<ArtigoDTOProps> {
  private constructor(props: ArtigoDTOProps) {
    super(props);
  }

  private static build(props: ArtigoDTOProps): ArtigoDTO {
    return new ArtigoDTO(props);
  }

  public static create(props: ArtigoDTOProps): ArtigoDTO {
    return this.build(props);
  }
}
