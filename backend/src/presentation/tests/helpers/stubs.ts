import { vi } from "vitest";
import type { ContaServices, MesaServices, SalaServices } from "../../../app";

export function stub_sala_services(
  overrides: Partial<SalaServices> = {},
): SalaServices {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    new: vi.fn(),
    set: vi.fn(),
    ...overrides,
  } as unknown as SalaServices;
}

export function stub_mesa_services(
  overrides: Partial<MesaServices> = {},
): MesaServices {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    new: vi.fn(),
    set: vi.fn(),
    ...overrides,
  } as unknown as MesaServices;
}

export function stub_conta_services(
  overrides: Partial<ContaServices> = {},
): ContaServices {
  return {
    count: vi.fn(),
    list: vi.fn(),
    load: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    new: vi.fn(),
    set: vi.fn(),
    addArtigo: vi.fn(),
    removeArtigo: vi.fn(),
    ...overrides,
  } as unknown as ContaServices;
}
