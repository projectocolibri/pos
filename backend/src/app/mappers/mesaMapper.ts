import { Mesa } from "../../domain";
import { MesaDTO } from "../dtos";

export class MesaMapper {
  static toDTO(mesa: Mesa): MesaDTO {
    return MesaDTO.create({
      nifEmpresa: mesa.props.nifEmpresa,
      mesaId: mesa.props.mesaId,
      salaId: mesa.props.salaId,
      nomeMesa: mesa.props.nomeMesa,
      estado: mesa.props.estado,
      obs: mesa.props.obs,
    });
  }

  static toDomain(mesaDTO: MesaDTO): Mesa {
    return Mesa.rebuild({
      nifEmpresa: mesaDTO.props.nifEmpresa,
      mesaId: mesaDTO.props.mesaId,
      salaId: mesaDTO.props.salaId,
      nomeMesa: mesaDTO.props.nomeMesa,
      estado: mesaDTO.props.estado,
      obs: mesaDTO.props.obs,
    });
  }
}
