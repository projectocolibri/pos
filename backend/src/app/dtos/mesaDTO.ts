import { DTO } from "./core";

interface MesaDTOProps extends Record<string, unknown> {
  nifEmpresa: string;
  mesaId: string;
  salaId: string;
  nomeMesa: string;
  estado: string;
  obs: string;
}

export class MesaDTO extends DTO<MesaDTOProps> {
  private constructor(props: MesaDTOProps) {
    super(props);
  }

  private static build(props: MesaDTOProps): MesaDTO {
    return new MesaDTO(props);
  }

  public static create(props: MesaDTOProps): MesaDTO {
    return this.build(props);
  }
}
