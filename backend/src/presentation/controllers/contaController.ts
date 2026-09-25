import { ContaServices } from "../../app";
import { ContaRequests } from "./requests";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class ContaController {
  constructor(
    @inject(ContaServices) private readonly contaServices: ContaServices,
  ) {}

  async count(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId } = ContaRequests.count(req);
    const count = await this.contaServices.count(nifEmpresa, mesaId);
    res.status(200).json(count);
  }

  async list(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId } = ContaRequests.list(req);
    const list = await this.contaServices.list(nifEmpresa, mesaId);
    res.status(200).json(list);
  }

  async load(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId } = ContaRequests.load(req);
    const load = await this.contaServices.load(nifEmpresa, mesaId, contaId);
    res.status(200).json(load);
  }

  async store(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, contaDTO } = ContaRequests.store(req);
    const store = await this.contaServices.store(nifEmpresa, contaDTO);
    res.status(200).json(store);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId } = ContaRequests.delete(req);
    await this.contaServices.delete(nifEmpresa, mesaId, contaId);
    res.status(200).json({ message: "Conta apagada com sucesso!" });
  }

  async new(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, nome } = ContaRequests.new(req);
    const newConta = await this.contaServices.new(nifEmpresa, mesaId, nome);
    res.status(201).json(newConta);
  }

  async set(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId, key, value } = ContaRequests.set(req);
    const set = await this.contaServices.set(
      nifEmpresa,
      mesaId,
      contaId,
      key,
      value,
    );
    res.status(200).json(set);
  }

  async addArtigo(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId, codigoArtigo } =
      ContaRequests.addArtigo(req);
    const add = await this.contaServices.addArtigo(
      nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    );
    res.status(200).json(add);
  }

  async removeArtigo(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaId, contaId, codigoArtigo } =
      ContaRequests.removeArtigo(req);
    const remove = await this.contaServices.removeArtigo(
      nifEmpresa,
      mesaId,
      contaId,
      codigoArtigo,
    );
    res.status(200).json(remove);
  }
}
