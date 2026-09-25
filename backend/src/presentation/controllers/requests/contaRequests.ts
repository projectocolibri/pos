import { Request } from "express";
import { ArtigoDTO, ContaDTO } from "../../../app/dtos";
import {
  parse_body,
  parse_query,
  conta_artigo_body,
  conta_delete_body,
  conta_load_query,
  conta_mesa_query,
  conta_set_body,
  conta_store_body,
  conta_new_body,
} from "./zod";

export class ContaRequests {
  static count_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
  } {
    const { mesaId } = parse_query(req, conta_mesa_query);
    return { nifEmpresa: req.nifEmpresa, mesaId };
  }

  static list_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
  } {
    const { mesaId } = parse_query(req, conta_mesa_query);
    return { nifEmpresa: req.nifEmpresa, mesaId };
  }

  static load_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
  } {
    const { mesaId, contaId } = parse_query(req, conta_load_query);
    return { nifEmpresa: req.nifEmpresa, mesaId, contaId };
  }

  static store_conta(req: Request): {
    nifEmpresa: string;
    contaDTO: ContaDTO;
  } {
    const { contaDTO } = parse_body(req, conta_store_body);
    return {
      nifEmpresa: req.nifEmpresa,
      contaDTO: ContaDTO.create({
        nifEmpresa: req.nifEmpresa,
        ...contaDTO,
        artigos: contaDTO.artigos.map((artigo) =>
          ArtigoDTO.create({
            nifEmpresa: req.nifEmpresa,
            ...artigo,
          }),
        ),
      }),
    };
  }

  static delete_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
  } {
    const { mesaId, contaId } = parse_body(req, conta_delete_body);
    return { nifEmpresa: req.nifEmpresa, mesaId, contaId };
  }

  static new_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    nome: string;
  } {
    const { mesaId, nome } = parse_body(req, conta_new_body);
    return { nifEmpresa: req.nifEmpresa, mesaId, nome };
  }

  static set_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
    key: string;
    value: unknown;
  } {
    const { mesaId, contaId, key, value } = parse_body(req, conta_set_body);
    return { nifEmpresa: req.nifEmpresa, mesaId, contaId, key, value };
  }

  static add_artigo_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
    codigoArtigo: string;
  } {
    const { mesaId, contaId, codigoArtigo } = parse_body(
      req,
      conta_artigo_body,
    );
    return {
      nifEmpresa: req.nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    };
  }

  static remove_artigo_conta(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
    codigoArtigo: string;
  } {
    const { mesaId, contaId, codigoArtigo } = parse_body(
      req,
      conta_artigo_body,
    );
    return {
      nifEmpresa: req.nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    };
  }
}
