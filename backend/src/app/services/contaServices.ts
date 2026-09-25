import { Conta } from "../../domain";
import type { IContaRepo, IIdGenerator } from "../../domain";
import { ContaDTO } from "../dtos";
import { ContaMapper } from "../mappers";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../shared/tokens";

@injectable()
export class ContaServices {
  constructor(
    @inject(TOKENS.IContaRepo) private readonly contaRepo: IContaRepo,
    @inject(TOKENS.IIdGenerator) private readonly idGenerator: IIdGenerator,
  ) {}

  async count_conta(nifEmpresa: string, mesaId: string): Promise<number> {
    return this.contaRepo.count(nifEmpresa, mesaId);
  }

  async list_conta(nifEmpresa: string, mesaId: string): Promise<ContaDTO[]> {
    return this.contaRepo
      .list(nifEmpresa, mesaId)
      .then((contas) => contas.map((conta) => ContaMapper.toDTO(conta)));
  }

  async load_conta(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
  ): Promise<ContaDTO> {
    return this.contaRepo
      .load(nifEmpresa, mesaId, contaId)
      .then((conta) => ContaMapper.toDTO(conta));
  }

  async store_conta(nifEmpresa: string, contaDTO: ContaDTO): Promise<ContaDTO> {
    return this.contaRepo
      .store(nifEmpresa, ContaMapper.toDomain(contaDTO))
      .then((conta) => ContaMapper.toDTO(conta));
  }

  async delete_conta(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
  ): Promise<void> {
    return this.contaRepo.delete(nifEmpresa, mesaId, contaId);
  }

  async new_conta(
    nifEmpresa: string,
    mesaId: string,
    nome: string,
  ): Promise<ContaDTO> {
    const conta = Conta.new(
      nifEmpresa,
      this.idGenerator.generate(),
      mesaId,
      nome,
    );
    return this.contaRepo
      .store(nifEmpresa, conta)
      .then((stored) => ContaMapper.toDTO(stored));
  }

  async set_conta(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
    key: string,
    value: unknown,
  ): Promise<ContaDTO> {
    const conta = await this.contaRepo.load(nifEmpresa, mesaId, contaId);
    conta.set(key, value);
    return this.contaRepo
      .store(nifEmpresa, conta)
      .then((stored) => ContaMapper.toDTO(stored));
  }

  async add_artigo_conta(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
    codigoArtigo: string,
  ): Promise<ContaDTO> {
    const conta = await this.contaRepo.load(nifEmpresa, mesaId, contaId);
    conta.addArtigo(codigoArtigo);
    return this.contaRepo
      .store(nifEmpresa, conta)
      .then((stored) => ContaMapper.toDTO(stored));
  }

  async remove_artigo_conta(
    nifEmpresa: string,
    mesaId: string,
    contaId: string,
    codigoArtigo: string,
  ): Promise<ContaDTO> {
    const conta = await this.contaRepo.load(nifEmpresa, mesaId, contaId);
    conta.removeArtigo(codigoArtigo);
    return this.contaRepo
      .store(nifEmpresa, conta)
      .then((stored) => ContaMapper.toDTO(stored));
  }
}
