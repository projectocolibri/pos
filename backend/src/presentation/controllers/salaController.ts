import { inject, injectable } from "tsyringe";
import { SalaServices } from "../../app";
import { SalaRequests } from "./requests";
import { Request, Response } from "express";

@injectable()
export class SalaController {
  constructor(
    @inject(SalaServices) private readonly salaServices: SalaServices,
  ) {}

  async count(req: Request, res: Response): Promise<void> {
    const { nifEmpresa } = SalaRequests.count(req);
    const count = await this.salaServices.count(nifEmpresa);
    res.status(200).json(count);
  }

  async list(req: Request, res: Response): Promise<void> {
    const { nifEmpresa } = SalaRequests.list(req);
    const list = await this.salaServices.list(nifEmpresa);
    res.status(200).json(list);
  }

  async load(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId } = SalaRequests.load(req);
    const load = await this.salaServices.load(nifEmpresa, salaId);
    res.status(200).json(load);
  }

  async store(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaDTO } = SalaRequests.store(req);
    const store = await this.salaServices.store(nifEmpresa, salaDTO);
    res.status(200).json(store);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId } = SalaRequests.delete(req);
    await this.salaServices.delete(nifEmpresa, salaId);
    res.status(200).json({ message: "Sala apagada com sucesso!" });
  }

  async new(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, nome } = SalaRequests.new(req);
    const newSala = await this.salaServices.new(nifEmpresa, nome);
    res.status(201).json(newSala);
  }

  async set(req: Request, res: Response): Promise<void> {
    const { nifEmpresa, salaId, key, value } = SalaRequests.set(req);
    const set = await this.salaServices.set(nifEmpresa, salaId, key, value);
    res.status(200).json(set);
  }
}
