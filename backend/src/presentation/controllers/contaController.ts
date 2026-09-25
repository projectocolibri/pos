import { ContaServices } from "../../app";
import { ContaRequests } from "./requests";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class ContaController {
  constructor(
    @inject(ContaServices) private readonly contaServices: ContaServices,
  ) {}

  async count_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId } = ContaRequests.count_conta(req);
    const count = await this.contaServices.count_conta(nifEmpresa, mesaId);
    res.status(200).json(count);
  }

  async list_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId } = ContaRequests.list_conta(req);
    const list = await this.contaServices.list_conta(nifEmpresa, mesaId);
    res.status(200).json(list);
  }

  async load_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId } = ContaRequests.load_conta(req);
    const load = await this.contaServices.load_conta(
      nifEmpresa,
      mesaId,
      contaId,
    );
    res.status(200).json(load);
  }

  async store_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, contaDTO } = ContaRequests.store_conta(req);
    const store = await this.contaServices.store_conta(nifEmpresa, contaDTO);
    res.status(200).json(store);
  }

  async delete_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId } = ContaRequests.delete_conta(req);
    await this.contaServices.delete_conta(nifEmpresa, mesaId, contaId);
    res.status(200).json({ message: "Conta apagada com sucesso!" });
  }

  async new_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, nome } = ContaRequests.new_conta(req);
    const newConta = await this.contaServices.new_conta(
      nifEmpresa,
      mesaId,
      nome,
    );
    res.status(201).json(newConta);
  }

  async set_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId, key, value } =
      ContaRequests.set_conta(req);
    const set = await this.contaServices.set_conta(
      nifEmpresa,
      mesaId,
      contaId,
      key,
      value,
    );
    res.status(200).json(set);
  }

  async add_artigo_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId, codigoArtigo } =
      ContaRequests.add_artigo_conta(req);
    const add = await this.contaServices.add_artigo_conta(
      nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    );
    res.status(200).json(add);
  }

  async remove_artigo_conta(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId, codigoArtigo } =
      ContaRequests.remove_artigo_conta(req);
    const remove = await this.contaServices.remove_artigo_conta(
      nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    );
    res.status(200).json(remove);
  }
}
