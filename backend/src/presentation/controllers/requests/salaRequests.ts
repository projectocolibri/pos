import { Request } from "express";
import { SalaDTO } from "../../../app/dtos";
import {
  parseBody,
  parseQuery,
  sala_id_query,
  sala_store_body,
  sala_delete_body,
  sala_set_body,
  sala_new_body,
} from "./zod";

export class SalaRequests {
  static count(req: Request): { nifEmpresa: string } {
    return { nifEmpresa: req.nifEmpresa };
  }

  static list(req: Request): { nifEmpresa: string } {
    return { nifEmpresa: req.nifEmpresa };
  }

  static load(req: Request): { nifEmpresa: string; salaId: string } {
    const { salaId } = parseQuery(req, sala_id_query);
    return { nifEmpresa: req.nifEmpresa, salaId };
  }

  static store(req: Request): { nifEmpresa: string; salaDTO: SalaDTO } {
    const { salaDTO } = parseBody(req, sala_store_body);
    return {
      nifEmpresa: req.nifEmpresa,
      salaDTO: SalaDTO.create({
        salaId: salaDTO.salaId,
        nifEmpresa: req.nifEmpresa,
        nome: salaDTO.nome,
      }),
    };
  }

  static delete(req: Request): { nifEmpresa: string; salaId: string } {
    const { salaId } = parseBody(req, sala_delete_body);
    return { nifEmpresa: req.nifEmpresa, salaId };
  }

  static new(req: Request): { nifEmpresa: string; nome: string } {
    const { nome } = parseBody(req, sala_new_body);
    return { nifEmpresa: req.nifEmpresa, nome };
  }

  static set(req: Request): {
    nifEmpresa: string;
    salaId: string;
    key: string;
    value: unknown;
  } {
    const { salaId, key, value } = parseBody(req, sala_set_body);
    return { nifEmpresa: req.nifEmpresa, salaId, key, value };
  }
}
