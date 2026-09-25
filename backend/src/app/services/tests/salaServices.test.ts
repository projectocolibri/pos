import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { Sala } from "../../../domain";
import { SalaDTO } from "../../dtos";
import { SalaServices } from "../salaServices";
import { stub_id_generator, stub_sala_repo } from "./stubs";

describe("SalaServices", () => {
  it("count returns repo count", async () => {
    const count = vi.fn().mockResolvedValue(3);
    const services = new SalaServices(
      stub_sala_repo({ count }),
      stub_id_generator("id"),
    );

    await expect(services.count("999999990")).resolves.toBe(3);
    expect(count).toHaveBeenCalledWith("999999990");
  });

  it("list maps salas to DTOs", async () => {
    const salas = [
      Sala.new("sala-1", "999999990", "Sala A"),
      Sala.new("sala-2", "999999990", "Sala B"),
    ];
    const list = vi.fn().mockResolvedValue(salas);
    const services = new SalaServices(
      stub_sala_repo({ list }),
      stub_id_generator("id"),
    );

    const result = await services.list("999999990");

    expect(list).toHaveBeenCalledWith("999999990");
    expect(result).toHaveLength(2);
    expect(result[0]!.props.salaId).toBe("sala-1");
    expect(result[1]!.props.salaId).toBe("sala-2");
  });

  it("load maps sala to DTO", async () => {
    const sala = Sala.new("sala-1", "999999990", "Sala A");
    const load = vi.fn().mockResolvedValue(sala);
    const services = new SalaServices(
      stub_sala_repo({ load }),
      stub_id_generator("id"),
    );

    const result = await services.load("999999990", "sala-1");

    expect(load).toHaveBeenCalledWith("999999990", "sala-1");
    expect(result.props.salaId).toBe("sala-1");
    expect(result.props.nome).toBe("Sala A");
  });

  it("store rebuilds sala and persists it", async () => {
    const stored = Sala.rebuild({
      salaId: "sala-1",
      nifEmpresa: "999999990",
      nome: "Sala A",
    });
    const store = vi.fn().mockResolvedValue(stored);
    const services = new SalaServices(
      stub_sala_repo({ store }),
      stub_id_generator("id"),
    );
    const salaDTO = SalaDTO.create({
      salaId: "sala-1",
      nifEmpresa: "999999990",
      nome: "Sala A",
    });

    const result = await services.store("999999990", salaDTO);

    expect(store).toHaveBeenCalledTimes(1);
    const arg = store.mock.calls[0]![0] as Sala;
    expect(arg.props.nifEmpresa).toBe("999999990");
    expect(arg.props.salaId).toBe("sala-1");
    expect(arg.props.nome).toBe("Sala A");
    expect(result.props.nome).toBe("Sala A");
  });

  it("delete delegates to repo", async () => {
    const delete_fn = vi.fn().mockResolvedValue(undefined);
    const services = new SalaServices(
      stub_sala_repo({ delete: delete_fn }),
      stub_id_generator("id"),
    );

    await services.delete("999999990", "sala-1");

    expect(delete_fn).toHaveBeenCalledWith("999999990", "sala-1");
  });

  it("new creates sala with generated id and stores it", async () => {
    const stored = Sala.new("generated-sala", "999999990", "Sala Nova");
    const store = vi.fn().mockResolvedValue(stored);
    const services = new SalaServices(
      stub_sala_repo({ store }),
      stub_id_generator("generated-sala"),
    );

    const result = await services.new("999999990", "Sala Nova");

    expect(store).toHaveBeenCalledTimes(1);
    const arg = store.mock.calls[0]![0] as Sala;
    expect(arg.props.salaId).toBe("generated-sala");
    expect(arg.props.nifEmpresa).toBe("999999990");
    expect(arg.props.nome).toBe("Sala Nova");
    expect(result.props.salaId).toBe("generated-sala");
  });

  it("set updates editable property and stores sala", async () => {
    const sala = Sala.new("sala-1", "999999990", "Sala A");
    const stored = Sala.rebuild({
      salaId: "sala-1",
      nifEmpresa: "999999990",
      nome: "Sala B",
    });
    const load = vi.fn().mockResolvedValue(sala);
    const store = vi.fn().mockResolvedValue(stored);
    const services = new SalaServices(
      stub_sala_repo({ load, store }),
      stub_id_generator("id"),
    );

    const result = await services.set(
      "999999990",
      "sala-1",
      "nome",
      "Sala B",
    );

    expect(load).toHaveBeenCalledWith("999999990", "sala-1");
    expect(sala.props.nome).toBe("Sala B");
    expect(store).toHaveBeenCalledWith(sala);
    expect(result.props.nome).toBe("Sala B");
  });
});
