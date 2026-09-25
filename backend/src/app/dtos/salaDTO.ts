import { DTO } from "./core";

interface SalaDTOProps extends Record<string, unknown> {
  salaId: string;
  nifEmpresa: string;
  nome: string;
}

export class SalaDTO extends DTO<SalaDTOProps> {
  private constructor(props: SalaDTOProps) {
    super(props);
  }

  private static build(props: SalaDTOProps): SalaDTO {
    return new SalaDTO(props);
  }

  public static create(props: SalaDTOProps): SalaDTO {
    return this.build(props);
  }
}
