import { Request } from "express";
import { MesaDTO } from "../../../app/dtos";
import {
  parseBody,
  parseQuery,
  mesa_sala_query,
  mesa_load_query,
  mesa_store_body,
  mesa_delete_body,
  mesa_set_body,
  mesa_new_body,
} from "./zod";

export class MesaRequests {
  static count(req: Request): { nifEmpresa: string; salaId: string } {
    const { salaId } = parseQuery(req, mesa_sala_query);
    return { nifEmpresa: req.nifEmpresa, salaId };
  }

  static list(req: Request): { nifEmpresa: string; salaId: string } {
    const { salaId } = parseQuery(req, mesa_sala_query);
    return { nifEmpresa: req.nifEmpresa, salaId };
  }

  static load(req: Request): {
    nifEmpresa: string;
    salaId: string;
    mesaId: string;
  } {
    const { salaId, mesaId } = parseQuery(req, mesa_load_query);
    return { nifEmpresa: req.nifEmpresa, salaId, mesaId };
  }

  static store(req: Request): { nifEmpresa: string; mesaDTO: MesaDTO } {
    const { mesaDTO } = parseBody(req, mesa_store_body);
    return {
      nifEmpresa: req.nifEmpresa,
      mesaDTO: MesaDTO.create({
        nifEmpresa: req.nifEmpresa,
        ...mesaDTO,
      }),
    };
  }

  static delete(req: Request): {
    nifEmpresa: string;
    salaId: string;
    mesaId: string;
  } {
    const { salaId, mesaId } = parseBody(req, mesa_delete_body);
    return { nifEmpresa: req.nifEmpresa, salaId, mesaId };
  }

  static new(req: Request): {
    nifEmpresa: string;
    salaId: string;
    nomeMesa: string;
  } {
    const { salaId, nomeMesa } = parseBody(req, mesa_new_body);
    return { nifEmpresa: req.nifEmpresa, salaId, nomeMesa };
  }

  static set(req: Request): {
    nifEmpresa: string;
    salaId: string;
    mesaId: string;
    key: string;
    value: unknown;
  } {
    const { salaId, mesaId, key, value } = parseBody(req, mesa_set_body);
    return { nifEmpresa: req.nifEmpresa, salaId, mesaId, key, value };
  }
}
