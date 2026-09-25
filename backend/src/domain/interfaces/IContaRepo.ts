import { Conta } from "../model";

export interface IContaRepo {
  count(nifEmpresa: string, mesaId: string): Promise<number>;
  list(nifEmpresa: string, mesaId: string): Promise<Conta[]>;
  load(nifEmpresa: string, mesaId: string, contaId: string): Promise<Conta>;
  store(nifEmpresa: string, conta: Conta): Promise<Conta>;
  delete(nifEmpresa: string, mesaId: string, contaId: string): Promise<void>;
}
