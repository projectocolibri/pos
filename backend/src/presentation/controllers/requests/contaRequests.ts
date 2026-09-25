import { Request } from "express";
import { ArtigoDTO, ContaDTO } from "../../../app/dtos";
import {
  parseBody,
  parseQuery,
  conta_artigo_body,
  conta_delete_body,
  conta_load_query,
  conta_mesa_query,
  conta_set_body,
  conta_store_body,
  conta_new_body,
} from "./zod";

export class ContaRequests {
  static count(req: Request): {
    nifEmpresa: string;
    mesaId: string;
  } {
    const { mesaId } = parseQuery(req, conta_mesa_query);
    return { nifEmpresa: req.nifEmpresa, mesaId };
  }

  static list(req: Request): {
    nifEmpresa: string;
    mesaId: string;
  } {
    const { mesaId } = parseQuery(req, conta_mesa_query);
    return { nifEmpresa: req.nifEmpresa, mesaId };
  }

  static load(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
  } {
    const { mesaId, contaId } = parseQuery(req, conta_load_query);
    return { nifEmpresa: req.nifEmpresa, mesaId, contaId };
  }

  static store(req: Request): {
    nifEmpresa: string;
    contaDTO: ContaDTO;
  } {
    const { contaDTO } = parseBody(req, conta_store_body);
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

  static delete(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
  } {
    const { mesaId, contaId } = parseBody(req, conta_delete_body);
    return { nifEmpresa: req.nifEmpresa, mesaId, contaId };
  }

  static new(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    nome: string;
  } {
    const { mesaId, nome } = parseBody(req, conta_new_body);
    return { nifEmpresa: req.nifEmpresa, mesaId, nome };
  }

  static set(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
    key: string;
    value: unknown;
  } {
    const { mesaId, contaId, key, value } = parseBody(req, conta_set_body);
    return { nifEmpresa: req.nifEmpresa, mesaId, contaId, key, value };
  }

  static addArtigo(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
    codigoArtigo: string;
  } {
    const { mesaId, contaId, codigoArtigo } = parseBody(req, conta_artigo_body);
    return {
      nifEmpresa: req.nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    };
  }

  static removeArtigo(req: Request): {
    nifEmpresa: string;
    mesaId: string;
    contaId: string;
    codigoArtigo: string;
  } {
    const { mesaId, contaId, codigoArtigo } = parseBody(req, conta_artigo_body);
    return {
      nifEmpresa: req.nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    };
  }
}
