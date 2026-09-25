import { vi } from "vitest";
import type {
  IContaRepo,
  IIdGenerator,
  IMesaRepo,
  ISalaRepo,
} from "../../../domain";

export function stub_id_generator(id: string): IIdGenerator {
  return { generate: () => id };
}

export function stub_sala_repo(overrides: Partial<ISalaRepo> = {}): ISalaRepo {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

export function stub_mesa_repo(overrides: Partial<IMesaRepo> = {}): IMesaRepo {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

export function stub_conta_repo(
  overrides: Partial<IContaRepo> = {},
): IContaRepo {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}
