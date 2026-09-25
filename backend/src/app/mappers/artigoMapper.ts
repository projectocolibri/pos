import { Artigo } from "../../domain";
import { ArtigoDTO } from "../dtos";

export class ArtigoMapper {
  static toDTO(artigo: Artigo): ArtigoDTO {
    return ArtigoDTO.create({
      nifEmpresa: artigo.props.nifEmpresa,
      contaId: artigo.props.contaId,
      codigoArtigo: artigo.props.codigoArtigo,
      quantidade: artigo.props.quantidade,
      desconto: artigo.props.desconto,
    });
  }
  static toDomain(artigoDTO: ArtigoDTO): Artigo {
    return Artigo.rebuild({
      nifEmpresa: artigoDTO.props.nifEmpresa,
      contaId: artigoDTO.props.contaId,
      codigoArtigo: artigoDTO.props.codigoArtigo,
      quantidade: artigoDTO.props.quantidade,
      desconto: artigoDTO.props.desconto,
    });
  }
}
