import { Mesa } from "../model";

export interface IMesaRepo {
  count(salaId: string): Promise<number>;
  list(salaId: string): Promise<Mesa[]>;
  load(salaId: string, mesaId: string): Promise<Mesa>;
  store(mesa: Mesa): Promise<Mesa>;
  delete(salaId: string, mesaId: string): Promise<void>;
}
