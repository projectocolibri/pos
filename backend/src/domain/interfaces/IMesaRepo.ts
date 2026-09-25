import { Mesa } from "../model";

export interface IMesaRepo {
  count(nifEmpresa: string, salaId: string): Promise<number>;
  list(nifEmpresa: string, salaId: string): Promise<Mesa[]>;
  load(nifEmpresa: string, salaId: string, mesaId: string): Promise<Mesa>;
  store(nifEmpresa: string, mesa: Mesa): Promise<Mesa>;
  delete(nifEmpresa: string, salaId: string, mesaId: string): Promise<void>;
}
