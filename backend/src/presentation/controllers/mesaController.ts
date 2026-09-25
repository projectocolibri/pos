import { MesaServices } from "../../app";
import { MesaRequests } from "./requests";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class MesaController {
  constructor(
    @inject(MesaServices) private readonly mesaServices: MesaServices,
  ) {}

  async count(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId } = MesaRequests.count(req);
    const count = await this.mesaServices.count(nifEmpresa, salaId);
    res.status(200).json(count);
  }

  async list(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId } = MesaRequests.list(req);
    const list = await this.mesaServices.list(nifEmpresa, salaId);
    res.status(200).json(list);
  }

  async load(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId, mesaId } = MesaRequests.load(req);
    const load = await this.mesaServices.load(nifEmpresa, salaId, mesaId);
    res.status(200).json(load);
  }

  async store(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, mesaDTO } = MesaRequests.store(req);
    const store = await this.mesaServices.store(nifEmpresa, mesaDTO);
    res.status(200).json(store);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId, mesaId } = MesaRequests.delete(req);
    await this.mesaServices.delete(nifEmpresa, salaId, mesaId);
    res.status(200).json({ message: "Mesa apagada com sucesso!" });
  }

  async new(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId, nomeMesa } = MesaRequests.new(req);
    const newMesa = await this.mesaServices.new(nifEmpresa, salaId, nomeMesa);
    res.status(201).json(newMesa);
  }

  async set(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId, mesaId, key, value } = MesaRequests.set(req);
    const set = await this.mesaServices.set(
      nifEmpresa,
      salaId,
      mesaId,
      key,
      value,
    );
    res.status(200).json(set);
  }
}
