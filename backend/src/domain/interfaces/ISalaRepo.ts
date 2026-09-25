import { Sala } from "../model";

export interface ISalaRepo {
  count(nifEmpresa: string): Promise<number>;
  list(nifEmpresa: string): Promise<Sala[]>;
  load(nifEmpresa: string, salaId: string): Promise<Sala>;
  store(sala: Sala): Promise<Sala>;
  delete(nifEmpresa: string, salaId: string): Promise<void>;
}
