import { Sala } from "../../domain";
import type { IIdGenerator, ISalaRepo } from "../../domain";
import { SalaMapper } from "../mappers";
import { SalaDTO } from "../dtos";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../shared/tokens";

@injectable()
export class SalaServices {
  constructor(
    @inject(TOKENS.ISalaRepo) private readonly salaRepo: ISalaRepo,
    @inject(TOKENS.IIdGenerator) private readonly idGenerator: IIdGenerator,
  ) {}

  async count(nifEmpresa: string): Promise<number> {
    return this.salaRepo.count(nifEmpresa);
  }

  async list(nifEmpresa: string): Promise<SalaDTO[]> {
    return this.salaRepo
      .list(nifEmpresa)
      .then((salas) => salas.map((sala) => SalaMapper.toDTO(sala)));
  }

  async load(nifEmpresa: string, salaId: string): Promise<SalaDTO> {
    return this.salaRepo
      .load(nifEmpresa, salaId)
      .then((sala) => SalaMapper.toDTO(sala));
  }

  async store(nifEmpresa: string, salaDTO: SalaDTO): Promise<SalaDTO> {
    const sala = Sala.rebuild({
      salaId: salaDTO.props.salaId,
      nifEmpresa,
      nome: salaDTO.props.nome,
    });
    return this.salaRepo
      .store(sala)
      .then((stored) => SalaMapper.toDTO(stored));
  }

  async delete(nifEmpresa: string, salaId: string): Promise<void> {
    return this.salaRepo.delete(nifEmpresa, salaId);
  }

  async new(nifEmpresa: string, nome: string): Promise<SalaDTO> {
    const sala = Sala.new(this.idGenerator.generate(), nifEmpresa, nome);
    return this.salaRepo
      .store(sala)
      .then((stored) => SalaMapper.toDTO(stored));
  }

  async set(
    nifEmpresa: string,
    salaId: string,
    key: string,
    value: unknown,
  ): Promise<SalaDTO> {
    const sala = await this.salaRepo.load(nifEmpresa, salaId);
    sala.set(key, value);
    return this.salaRepo
      .store(sala)
      .then((stored) => SalaMapper.toDTO(stored));
  }
}
