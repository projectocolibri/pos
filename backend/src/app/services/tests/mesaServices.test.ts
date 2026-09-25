import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { Mesa } from "../../../domain";
import { MesaDTO } from "../../dtos";
import { MesaServices } from "../mesaServices";
import { stub_id_generator, stub_mesa_repo } from "./stubs";

describe("MesaServices", () => {
  it("count returns repo count", async () => {
    const count = vi.fn().mockResolvedValue(4);
    const services = new MesaServices(
      stub_mesa_repo({ count }),
      stub_id_generator("id"),
    );

    await expect(services.count("999999990", "sala-1")).resolves.toBe(4);
    expect(count).toHaveBeenCalledWith("999999990", "sala-1");
  });

  it("list maps mesas to DTOs", async () => {
    const mesas = [
      Mesa.new("999999990", "mesa-1", "sala-1", "Mesa A"),
      Mesa.new("999999990", "mesa-2", "sala-1", "Mesa B"),
    ];
    const list = vi.fn().mockResolvedValue(mesas);
    const services = new MesaServices(
      stub_mesa_repo({ list }),
      stub_id_generator("id"),
    );

    const result = await services.list("999999990", "sala-1");

    expect(list).toHaveBeenCalledWith("999999990", "sala-1");
    expect(result).toHaveLength(2);
    expect(result[0]!.props.mesaId).toBe("mesa-1");
    expect(result[1]!.props.mesaId).toBe("mesa-2");
  });

  it("load maps mesa to DTO", async () => {
    const mesa = Mesa.new("999999990", "mesa-1", "sala-1", "Mesa A");
    const load = vi.fn().mockResolvedValue(mesa);
    const services = new MesaServices(
      stub_mesa_repo({ load }),
      stub_id_generator("id"),
    );

    const result = await services.load("999999990", "sala-1", "mesa-1");

    expect(load).toHaveBeenCalledWith("999999990", "sala-1", "mesa-1");
    expect(result.props.mesaId).toBe("mesa-1");
    expect(result.props.nomeMesa).toBe("Mesa A");
  });

  it("store maps DTO to domain and persists it", async () => {
    const stored = Mesa.rebuild({
      nifEmpresa: "999999990",
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "janela",
    });
    const store = vi.fn().mockResolvedValue(stored);
    const services = new MesaServices(
      stub_mesa_repo({ store }),
      stub_id_generator("id"),
    );
    const mesaDTO = MesaDTO.create({
      nifEmpresa: "999999990",
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "janela",
    });

    const result = await services.store("999999990", mesaDTO);

    expect(store).toHaveBeenCalledTimes(1);
    const [nif, mesa] = store.mock.calls[0]!;
    expect(nif).toBe("999999990");
    expect((mesa as Mesa).props.mesaId).toBe("mesa-1");
    expect((mesa as Mesa).props.nomeMesa).toBe("Mesa A");
    expect(result.props.nomeMesa).toBe("Mesa A");
  });

  it("delete delegates to repo", async () => {
    const delete_fn = vi.fn().mockResolvedValue(undefined);
    const services = new MesaServices(
      stub_mesa_repo({ delete: delete_fn }),
      stub_id_generator("id"),
    );

    await services.delete("999999990", "sala-1", "mesa-1");

    expect(delete_fn).toHaveBeenCalledWith(
      "999999990",
      "sala-1",
      "mesa-1",
    );
  });

  it("new creates mesa with generated id and stores it", async () => {
    const stored = Mesa.new(
      "999999990",
      "generated-mesa",
      "sala-1",
      "Mesa Nova",
    );
    const store = vi.fn().mockResolvedValue(stored);
    const services = new MesaServices(
      stub_mesa_repo({ store }),
      stub_id_generator("generated-mesa"),
    );

    const result = await services.new("999999990", "sala-1", "Mesa Nova");

    expect(store).toHaveBeenCalledTimes(1);
    const [nif, mesa] = store.mock.calls[0]!;
    expect(nif).toBe("999999990");
    expect((mesa as Mesa).props.mesaId).toBe("generated-mesa");
    expect((mesa as Mesa).props.salaId).toBe("sala-1");
    expect((mesa as Mesa).props.nomeMesa).toBe("Mesa Nova");
    expect((mesa as Mesa).props.estado).toBe("livre");
    expect(result.props.mesaId).toBe("generated-mesa");
  });

  it("set updates editable property and stores mesa", async () => {
    const mesa = Mesa.new("999999990", "mesa-1", "sala-1", "Mesa A");
    const stored = Mesa.rebuild({
      nifEmpresa: "999999990",
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa B",
      estado: "livre",
      obs: "",
    });
    const load = vi.fn().mockResolvedValue(mesa);
    const store = vi.fn().mockResolvedValue(stored);
    const services = new MesaServices(
      stub_mesa_repo({ load, store }),
      stub_id_generator("id"),
    );

    const result = await services.set(
      "999999990",
      "sala-1",
      "mesa-1",
      "nomeMesa",
      "Mesa B",
    );

    expect(load).toHaveBeenCalledWith("999999990", "sala-1", "mesa-1");
    expect(mesa.props.nomeMesa).toBe("Mesa B");
    expect(store).toHaveBeenCalledWith("999999990", mesa);
    expect(result.props.nomeMesa).toBe("Mesa B");
  });
});
