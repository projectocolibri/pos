import { Conta } from "../../domain";
import { ContaDTO } from "../dtos";
import { ArtigoMapper } from "./artigoMapper";

export class ContaMapper {
  static toDTO(conta: Conta): ContaDTO {
    return ContaDTO.create({
      nifEmpresa: conta.props.nifEmpresa,
      contaId: conta.props.contaId,
      mesaId: conta.props.mesaId,
      entidade: conta.props.entidade,
      nome: conta.props.nome,
      morada: conta.props.morada,
      codigoPostal: conta.props.codigoPostal,
      localidade: conta.props.localidade,
      nif: conta.props.nif,
      artigos: conta.getArtigos().map((artigo) => ArtigoMapper.toDTO(artigo)),
    });
  }

  static toDomain(contaDTO: ContaDTO): Conta {
    return Conta.rebuild({
      nifEmpresa: contaDTO.props.nifEmpresa,
      contaId: contaDTO.props.contaId,
      mesaId: contaDTO.props.mesaId,
      entidade: contaDTO.props.entidade,
      nome: contaDTO.props.nome,
      morada: contaDTO.props.morada,
      codigoPostal: contaDTO.props.codigoPostal,
      localidade: contaDTO.props.localidade,
      nif: contaDTO.props.nif,
      artigos: contaDTO.props.artigos.map((artigo) =>
        ArtigoMapper.toDomain(artigo),
      ),
    });
  }
}
