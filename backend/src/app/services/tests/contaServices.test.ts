import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { Conta } from "../../../domain";
import { ContaDTO } from "../../dtos";
import { ContaServices } from "../contaServices";
import { stub_conta_repo, stub_id_generator } from "./stubs";

describe("ContaServices", () => {
  it("count_conta returns repo count", async () => {
    const count = vi.fn().mockResolvedValue(2);
    const services = new ContaServices(
      stub_conta_repo({ count }),
      stub_id_generator("id"),
    );

    await expect(services.count("999999990", "mesa-1")).resolves.toBe(2);
    expect(count).toHaveBeenCalledWith("999999990", "mesa-1");
  });

  it("list_conta maps contas to DTOs", async () => {
    const contas = [
      Conta.new("999999990", "conta-1", "mesa-1", "Cliente 1"),
      Conta.new("999999990", "conta-2", "mesa-1", "Cliente 2"),
    ];
    const list = vi.fn().mockResolvedValue(contas);
    const services = new ContaServices(
      stub_conta_repo({ list }),
      stub_id_generator("id"),
    );

    const result = await services.list("999999990", "mesa-1");

    expect(list).toHaveBeenCalledWith("999999990", "mesa-1");
    expect(result).toHaveLength(2);
    expect(result[0]!.props.contaId).toBe("conta-1");
    expect(result[1]!.props.contaId).toBe("conta-2");
  });

  it("load_conta maps conta to DTO", async () => {
    const conta = Conta.new("999999990", "conta-1", "mesa-1", "Cliente");
    const load = vi.fn().mockResolvedValue(conta);
    const services = new ContaServices(
      stub_conta_repo({ load }),
      stub_id_generator("id"),
    );

    const result = await services.load("999999990", "mesa-1", "conta-1");

    expect(load).toHaveBeenCalledWith("999999990", "mesa-1", "conta-1");
    expect(result.props.contaId).toBe("conta-1");
    expect(result.props.nome).toBe("Cliente");
  });

  it("store_conta maps DTO to domain and persists it", async () => {
    const stored = Conta.rebuild({
      nifEmpresa: "999999990",
      contaId: "conta-1",
      mesaId: "mesa-1",
      entidade: 10,
      nome: "Cliente",
      morada: "Rua A",
      codigoPostal: "1000-001",
      localidade: "Lisboa",
      nif: "123456789",
      artigos: [],
    });
    const store = vi.fn().mockResolvedValue(stored);
    const services = new ContaServices(
      stub_conta_repo({ store }),
      stub_id_generator("id"),
    );
    const contaDTO = ContaDTO.create({
      nifEmpresa: "999999990",
      contaId: "conta-1",
      mesaId: "mesa-1",
      entidade: 10,
      nome: "Cliente",
      morada: "Rua A",
      codigoPostal: "1000-001",
      localidade: "Lisboa",
      nif: "123456789",
      artigos: [],
    });

    const result = await services.store("999999990", contaDTO);

    expect(store).toHaveBeenCalledTimes(1);
    const [nif, conta] = store.mock.calls[0]!;
    expect(nif).toBe("999999990");
    expect((conta as Conta).props.contaId).toBe("conta-1");
    expect((conta as Conta).props.nome).toBe("Cliente");
    expect(result.props.nome).toBe("Cliente");
  });

  it("delete_conta delegates to repo", async () => {
    const delete_fn = vi.fn().mockResolvedValue(undefined);
    const services = new ContaServices(
      stub_conta_repo({ delete: delete_fn }),
      stub_id_generator("id"),
    );

    await services.delete("999999990", "mesa-1", "conta-1");

    expect(delete_fn).toHaveBeenCalledWith("999999990", "mesa-1", "conta-1");
  });

  it("new_conta creates conta with generated id and stores it", async () => {
    const stored = Conta.new(
      "999999990",
      "generated-conta",
      "mesa-1",
      "Cliente",
    );
    const store = vi.fn().mockResolvedValue(stored);
    const services = new ContaServices(
      stub_conta_repo({ store }),
      stub_id_generator("generated-conta"),
    );

    const result = await services.new("999999990", "mesa-1", "Cliente");

    expect(store).toHaveBeenCalledTimes(1);
    const [nif, conta] = store.mock.calls[0]!;
    expect(nif).toBe("999999990");
    expect((conta as Conta).props.contaId).toBe("generated-conta");
    expect((conta as Conta).props.mesaId).toBe("mesa-1");
    expect((conta as Conta).props.nome).toBe("Cliente");
    expect(result.props.contaId).toBe("generated-conta");
  });

  it("set_conta updates editable property and stores conta", async () => {
    const conta = Conta.new("999999990", "conta-1", "mesa-1", "Cliente");
    const stored = Conta.rebuild({
      nifEmpresa: "999999990",
      contaId: "conta-1",
      mesaId: "mesa-1",
      entidade: 0,
      nome: "Cliente B",
      morada: "",
      codigoPostal: "",
      localidade: "",
      nif: "",
      artigos: [],
    });
    const load = vi.fn().mockResolvedValue(conta);
    const store = vi.fn().mockResolvedValue(stored);
    const services = new ContaServices(
      stub_conta_repo({ load, store }),
      stub_id_generator("id"),
    );

    const result = await services.set(
      "999999990",
      "mesa-1",
      "conta-1",
      "nome",
      "Cliente B",
    );

    expect(load).toHaveBeenCalledWith("999999990", "mesa-1", "conta-1");
    expect(conta.props.nome).toBe("Cliente B");
    expect(store).toHaveBeenCalledWith("999999990", conta);
    expect(result.props.nome).toBe("Cliente B");
  });

  it("add_artigo_conta adds artigo, stores conta and returns DTO", async () => {
    const conta = Conta.new("999999990", "conta-1", "mesa-1", "Cliente");
    const load = vi.fn().mockResolvedValue(conta);
    const store = vi
      .fn()
      .mockImplementation(async (_nif, stored: Conta) => stored);
    const services = new ContaServices(
      stub_conta_repo({ load, store }),
      stub_id_generator("id"),
    );

    const result = await services.addArtigo(
      "999999990",
      "mesa-1",
      "conta-1",
      "A1",
    );

    expect(load).toHaveBeenCalledWith("999999990", "mesa-1", "conta-1");
    expect(conta.getArtigo("A1")?.props.codigoArtigo).toBe("A1");
    expect(store).toHaveBeenCalledWith("999999990", conta);
    expect(result.props.artigos).toHaveLength(1);
    expect(result.props.artigos[0]!.props.codigoArtigo).toBe("A1");
  });

  it("add_artigo_conta increments quantidade when artigo already exists", async () => {
    const conta = Conta.new("999999990", "conta-1", "mesa-1", "Cliente");
    conta.addArtigo("A1");
    const load = vi.fn().mockResolvedValue(conta);
    const store = vi
      .fn()
      .mockImplementation(async (_nif, stored: Conta) => stored);
    const services = new ContaServices(
      stub_conta_repo({ load, store }),
      stub_id_generator("id"),
    );

    const result = await services.addArtigo(
      "999999990",
      "mesa-1",
      "conta-1",
      "A1",
    );

    expect(conta.getArtigos()).toHaveLength(1);
    expect(conta.getArtigo("A1")?.props.quantidade).toBe(2);
    expect(store).toHaveBeenCalledWith("999999990", conta);
    expect(result.props.artigos).toHaveLength(1);
    expect(result.props.artigos[0]!.props.quantidade).toBe(2);
  });

  it("remove_artigo_conta removes artigo, stores conta and returns DTO", async () => {
    const conta = Conta.new("999999990", "conta-1", "mesa-1", "Cliente");
    conta.addArtigo("A1");
    const load = vi.fn().mockResolvedValue(conta);
    const store = vi
      .fn()
      .mockImplementation(async (_nif, stored: Conta) => stored);
    const services = new ContaServices(
      stub_conta_repo({ load, store }),
      stub_id_generator("id"),
    );

    const result = await services.removeArtigo(
      "999999990",
      "mesa-1",
      "conta-1",
      "A1",
    );

    expect(load).toHaveBeenCalledWith("999999990", "mesa-1", "conta-1");
    expect(conta.getArtigo("A1")).toBeUndefined();
    expect(store).toHaveBeenCalledWith("999999990", conta);
    expect(result.props.artigos).toHaveLength(0);
  });

  it("remove_artigo_conta propagates missing artigo error", async () => {
    const conta = Conta.new("999999990", "conta-1", "mesa-1", "Cliente");
    const load = vi.fn().mockResolvedValue(conta);
    const services = new ContaServices(
      stub_conta_repo({ load }),
      stub_id_generator("id"),
    );

    await expect(
      services.removeArtigo("999999990", "mesa-1", "conta-1", "MISSING"),
    ).rejects.toThrow("Artigo não encontrado!");
  });
});
