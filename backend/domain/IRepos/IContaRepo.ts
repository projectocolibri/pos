import { Artigo, Conta } from "../model";

export interface IContaRepo {
  count_conta(mesaId: string): Promise<number>;
  list_conta(mesaId: string): Promise<Conta[]>;
  load_conta(contaId: string): Promise<Conta>;
  store_conta(conta: Conta): Promise<Conta>;
  delete_conta(contaId: string): Promise<void>;
  count_artigo(contaId: string): Promise<number>;
  list_artigo(contaId: string): Promise<Artigo[]>;
  load_artigo(codigoArtigo: string): Promise<Artigo>;
  store_artigo(contaId: string, artigo: Artigo): Promise<Artigo>;
  delete_artigo(contaId: string, codigoArtigo: string): Promise<void>;
}
