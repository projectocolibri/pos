import { Sala } from "../../domain";
import { SalaDTO } from "../dtos";

export class SalaMapper {
  static toDTO(sala: Sala): SalaDTO {
    return SalaDTO.create({
      salaId: sala.props.salaId,
      nifEmpresa: sala.props.nifEmpresa,
      nome: sala.props.nome,
    });
  }

  static toDomain(salaDTO: SalaDTO): Sala {
    return Sala.rebuild({
      salaId: salaDTO.props.salaId,
      nifEmpresa: salaDTO.props.nifEmpresa,
      nome: salaDTO.props.nome,
    });
  }
}
