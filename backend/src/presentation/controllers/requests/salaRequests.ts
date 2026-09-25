import { Request } from "express";
import { SalaDTO } from "../../../app/dtos";
import {
  parse_body,
  parse_query,
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
    const { salaId } = parse_query(req, sala_id_query);
    return { nifEmpresa: req.nifEmpresa, salaId };
  }

  static store(req: Request): { nifEmpresa: string; salaDTO: SalaDTO } {
    const { salaDTO } = parse_body(req, sala_store_body);
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
    const { salaId } = parse_body(req, sala_delete_body);
    return { nifEmpresa: req.nifEmpresa, salaId };
  }

  static new(req: Request): { nifEmpresa: string; nome: string } {
    const { nome } = parse_body(req, sala_new_body);
    return { nifEmpresa: req.nifEmpresa, nome };
  }

  static set(req: Request): {
    nifEmpresa: string;
    salaId: string;
    key: string;
    value: unknown;
  } {
    const { salaId, key, value } = parse_body(req, sala_set_body);
    return { nifEmpresa: req.nifEmpresa, salaId, key, value };
  }
}
