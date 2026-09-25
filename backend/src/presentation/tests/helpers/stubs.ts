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
    count_conta: vi.fn(),
    list_conta: vi.fn(),
    load_conta: vi.fn(),
    store_conta: vi.fn(),
    delete_conta: vi.fn(),
    new_conta: vi.fn(),
    set_conta: vi.fn(),
    add_artigo_conta: vi.fn(),
    remove_artigo_conta: vi.fn(),
    ...overrides,
  } as unknown as ContaServices;
}
