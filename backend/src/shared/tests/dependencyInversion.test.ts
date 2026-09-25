import "reflect-metadata";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { container } from "tsyringe";
import { ContaServices, MesaServices, SalaServices } from "../../app";
import type {
  IContaRepo,
  IIdGenerator,
  IMesaRepo,
  ISalaRepo,
  Sala,
} from "../../domain";
import {
  ContaRepo,
  DatabaseContext,
  IdGenerator,
  Logger,
  MesaRepo,
  SalaRepo,
} from "../../infra";
import {
  ContaController,
  MesaController,
  SalaController,
} from "../../presentation/controllers";
import { TOKENS } from "../tokens";

const shared_dir = dirname(fileURLToPath(import.meta.url));
const src_root = join(shared_dir, "..", "..");

function read_src(...parts: string[]): string {
  return readFileSync(join(src_root, ...parts), "utf8");
}

function stub_sala_repo(overrides: Partial<ISalaRepo> = {}): ISalaRepo {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

function stub_mesa_repo(overrides: Partial<IMesaRepo> = {}): IMesaRepo {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

function stub_conta_repo(overrides: Partial<IContaRepo> = {}): IContaRepo {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

function stub_id_generator(id = "id-1"): IIdGenerator {
  return { generate: () => id };
}

function register_composition_root_with_fake_db(): void {
  container.reset();
  container.registerInstance(DatabaseContext, {
    db: {},
  } as unknown as DatabaseContext);
  container.registerSingleton(TOKENS.ISalaRepo, SalaRepo);
  container.registerSingleton(TOKENS.IMesaRepo, MesaRepo);
  container.registerSingleton(TOKENS.IContaRepo, ContaRepo);
  container.registerSingleton(TOKENS.IIdGenerator, IdGenerator);
  container.registerSingleton(ContaServices);
  container.registerSingleton(MesaServices);
  container.registerSingleton(SalaServices);
  container.registerSingleton(ContaController);
  container.registerSingleton(MesaController);
  container.registerSingleton(SalaController);
  container.registerSingleton(Logger);
}

describe("dependency inversion — source contracts", () => {
  it("application services depend on their ports, not concrete repos", () => {
    const checks: Array<{
      file: string;
      ports: string[];
      concrete: string[];
    }> = [
      {
        file: "app/services/salaServices.ts",
        ports: ["ISalaRepo", "IIdGenerator"],
        concrete: ["SalaRepo", "IdGenerator"],
      },
      {
        file: "app/services/mesaServices.ts",
        ports: ["IMesaRepo", "IIdGenerator"],
        concrete: ["MesaRepo", "IdGenerator"],
      },
      {
        file: "app/services/contaServices.ts",
        ports: ["IContaRepo", "IIdGenerator"],
        concrete: ["ContaRepo", "IdGenerator"],
      },
    ];

    for (const { file, ports, concrete } of checks) {
      const src = read_src(file);
      for (const port of ports) {
        expect(src).toContain(port);
        expect(src).toContain(`TOKENS.${port}`);
      }
      let without_ports = src;
      for (const port of ports) {
        without_ports = without_ports.replaceAll(port, "");
      }
      for (const name of concrete) {
        expect(without_ports).not.toContain(name);
      }
      expect(src).not.toMatch(/from ["'].*infra/);
      expect(src).not.toContain("IArtigoRepo");
      expect(src).not.toContain("ArtigoRepo");
    }
  });

  it("controllers depend on application services, not repos", () => {
    for (const file of [
      "presentation/controllers/salaController.ts",
      "presentation/controllers/mesaController.ts",
      "presentation/controllers/contaController.ts",
    ]) {
      const src = read_src(file);
      expect(src).not.toContain("SalaRepo");
      expect(src).not.toContain("MesaRepo");
      expect(src).not.toContain("ContaRepo");
      expect(src).not.toContain("ISalaRepo");
      expect(src).not.toContain("IMesaRepo");
      expect(src).not.toContain("IContaRepo");
      expect(src).toMatch(/Services/);
    }
  });

  it("composition root binds all repo and id-generator tokens", () => {
    const src = read_src("shared/container.ts");
    expect(src).toMatch(
      /registerSingleton\(\s*TOKENS\.ISalaRepo\s*,\s*SalaRepo\s*\)/,
    );
    expect(src).toMatch(
      /registerSingleton\(\s*TOKENS\.IMesaRepo\s*,\s*MesaRepo\s*\)/,
    );
    expect(src).toMatch(
      /registerSingleton\(\s*TOKENS\.IContaRepo\s*,\s*ContaRepo\s*\)/,
    );
    expect(src).not.toContain("IArtigoRepo");
    expect(src).not.toContain("ArtigoRepo");
    expect(src).toMatch(
      /registerSingleton\(\s*TOKENS\.IIdGenerator\s*,\s*IdGenerator\s*\)/,
    );
  });
});

describe("dependency inversion — container wiring", () => {
  beforeEach(() => {
    register_composition_root_with_fake_db();
  });

  it("resolves each repo token to its concrete class", () => {
    expect(container.resolve<ISalaRepo>(TOKENS.ISalaRepo)).toBeInstanceOf(
      SalaRepo,
    );
    expect(container.resolve<IMesaRepo>(TOKENS.IMesaRepo)).toBeInstanceOf(
      MesaRepo,
    );
    expect(container.resolve<IContaRepo>(TOKENS.IContaRepo)).toBeInstanceOf(
      ContaRepo,
    );
    expect(
      container.resolve<IIdGenerator>(TOKENS.IIdGenerator),
    ).toBeInstanceOf(IdGenerator);
  });

  it("resolves the same singletons for all consumers", () => {
    const sala_services = container.resolve(SalaServices);
    const mesa_services = container.resolve(MesaServices);
    const conta_services = container.resolve(ContaServices);

    expect(sala_services).toBeInstanceOf(SalaServices);
    expect(mesa_services).toBeInstanceOf(MesaServices);
    expect(conta_services).toBeInstanceOf(ContaServices);
    expect(container.resolve(SalaServices)).toBe(sala_services);
    expect(container.resolve(MesaServices)).toBe(mesa_services);
    expect(container.resolve(ContaServices)).toBe(conta_services);
  });

  it("resolves controllers with their application services", () => {
    expect(container.resolve(SalaController)).toBeInstanceOf(SalaController);
    expect(container.resolve(MesaController)).toBeInstanceOf(MesaController);
    expect(container.resolve(ContaController)).toBeInstanceOf(ContaController);
    expect(container.resolve(SalaController)).toBe(
      container.resolve(SalaController),
    );
  });

  it("shares IIdGenerator singleton across services", () => {
    const first = container.resolve<IIdGenerator>(TOKENS.IIdGenerator);
    const second = container.resolve<IIdGenerator>(TOKENS.IIdGenerator);
    expect(first).toBe(second);
    expect(first).toBeInstanceOf(IdGenerator);
  });
});

describe("dependency inversion — substitutable ports", () => {
  beforeEach(() => {
    container.reset();
  });

  it("SalaServices uses the injected ISalaRepo implementation", async () => {
    const count = vi.fn().mockResolvedValue(5);
    container.registerInstance(TOKENS.ISalaRepo, stub_sala_repo({ count }));
    container.registerInstance(TOKENS.IIdGenerator, stub_id_generator());
    container.registerSingleton(SalaServices);

    const services = container.resolve(SalaServices);
    await expect(services.count("999999990")).resolves.toBe(5);
    expect(count).toHaveBeenCalledWith("999999990");
    expect(services).not.toBeInstanceOf(SalaRepo);
  });

  it("MesaServices uses the injected IMesaRepo implementation", async () => {
    const count = vi.fn().mockResolvedValue(3);
    container.registerInstance(TOKENS.IMesaRepo, stub_mesa_repo({ count }));
    container.registerInstance(TOKENS.IIdGenerator, stub_id_generator());
    container.registerSingleton(MesaServices);

    const services = container.resolve(MesaServices);
    await expect(services.count("999999990", "sala-1")).resolves.toBe(3);
    expect(count).toHaveBeenCalledWith("999999990", "sala-1");
  });

  it("ContaServices uses the injected IContaRepo implementation", async () => {
    const count = vi.fn().mockResolvedValue(2);
    container.registerInstance(TOKENS.IContaRepo, stub_conta_repo({ count }));
    container.registerInstance(TOKENS.IIdGenerator, stub_id_generator());
    container.registerSingleton(ContaServices);

    const services = container.resolve(ContaServices);
    await expect(
      services.count_conta("999999990", "mesa-1"),
    ).resolves.toBe(2);
    expect(count).toHaveBeenCalledWith("999999990", "mesa-1");
  });

  it("swapping ISalaRepo changes service behavior without changing the service class", async () => {
    container.registerInstance(
      TOKENS.ISalaRepo,
      stub_sala_repo({
        count: vi.fn().mockResolvedValue(1),
      }),
    );
    container.registerInstance(TOKENS.IIdGenerator, stub_id_generator());
    container.registerSingleton(SalaServices);

    const first = container.resolve(SalaServices);
    await expect(first.count("nif")).resolves.toBe(1);

    container.reset();
    const second_repo = stub_sala_repo({
      count: vi.fn().mockResolvedValue(99),
      store: vi.fn(async (sala: Sala) => sala),
    });
    container.registerInstance(TOKENS.ISalaRepo, second_repo);
    container.registerInstance(
      TOKENS.IIdGenerator,
      stub_id_generator("generated"),
    );
    container.registerSingleton(SalaServices);

    const second = container.resolve(SalaServices);
    await expect(second.count("999999990")).resolves.toBe(99);
    const created = await second.new("999999990", "Sala Nova");
    expect(created.props.salaId).toBe("generated");
    expect(second_repo.store).toHaveBeenCalled();
  });

  it("controllers resolve against services wired to substitute ports", async () => {
    const list = vi.fn().mockResolvedValue([]);
    container.registerInstance(TOKENS.ISalaRepo, stub_sala_repo({ list }));
    container.registerInstance(TOKENS.IIdGenerator, stub_id_generator());
    container.registerSingleton(SalaServices);
    container.registerSingleton(SalaController);

    const controller = container.resolve(SalaController);
    const services = container.resolve(SalaServices);
    await services.list("999999990");

    expect(controller).toBeInstanceOf(SalaController);
    expect(list).toHaveBeenCalledWith("999999990");
  });
});
