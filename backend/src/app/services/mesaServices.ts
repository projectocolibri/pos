import { Mesa } from "../../domain";
import type { IIdGenerator, IMesaRepo } from "../../domain";
import { MesaDTO } from "../dtos";
import { MesaMapper } from "../mappers";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../shared/tokens";

@injectable()
export class MesaServices {
  constructor(
    @inject(TOKENS.IMesaRepo) private readonly mesaRepo: IMesaRepo,
    @inject(TOKENS.IIdGenerator) private readonly idGenerator: IIdGenerator,
  ) {}

  async count(nifEmpresa: string, salaId: string): Promise<number> {
    return this.mesaRepo.count(nifEmpresa, salaId);
  }

  async list(nifEmpresa: string, salaId: string): Promise<MesaDTO[]> {
    return this.mesaRepo
      .list(nifEmpresa, salaId)
      .then((mesas) => mesas.map((mesa) => MesaMapper.toDTO(mesa)));
  }

  async load(
    nifEmpresa: string,
    salaId: string,
    mesaId: string,
  ): Promise<MesaDTO> {
    return this.mesaRepo
      .load(nifEmpresa, salaId, mesaId)
      .then((mesa) => MesaMapper.toDTO(mesa));
  }

  async store(nifEmpresa: string, mesaDTO: MesaDTO): Promise<MesaDTO> {
    return this.mesaRepo
      .store(nifEmpresa, MesaMapper.toDomain(mesaDTO))
      .then((mesa) => MesaMapper.toDTO(mesa));
  }

  async delete(
    nifEmpresa: string,
    salaId: string,
    mesaId: string,
  ): Promise<void> {
    return this.mesaRepo.delete(nifEmpresa, salaId, mesaId);
  }

  async new(
    nifEmpresa: string,
    salaId: string,
    nomeMesa: string,
  ): Promise<MesaDTO> {
    const mesa = Mesa.new(
      nifEmpresa,
      this.idGenerator.generate(),
      salaId,
      nomeMesa,
    );
    return this.mesaRepo
      .store(nifEmpresa, mesa)
      .then((stored) => MesaMapper.toDTO(stored));
  }

  async set(
    nifEmpresa: string,
    salaId: string,
    mesaId: string,
    key: string,
    value: unknown,
  ): Promise<MesaDTO> {
    const mesa = await this.mesaRepo.load(nifEmpresa, salaId, mesaId);
    mesa.set(key, value);
    return this.mesaRepo
      .store(nifEmpresa, mesa)
      .then((stored) => MesaMapper.toDTO(stored));
  }
}
