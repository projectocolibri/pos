import { describe, expect, it } from "vitest";
import { Mesa } from "../mesa";

const NIF = "123456789";

describe("Mesa", () => {
  it("new creates mesa with defaults", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    expect(mesa.props).toEqual({
      nifEmpresa: NIF,
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "",
    });
  });

  it("new rejects empty mesaId", () => {
    expect(() => Mesa.new(NIF, "", "sala-1", "Mesa A")).toThrow(
      "ID da mesa não pode ser vazio!",
    );
  });

  it("new rejects empty salaId", () => {
    expect(() => Mesa.new(NIF, "mesa-1", "", "Mesa A")).toThrow(
      "ID da sala não pode ser vazio!",
    );
  });

  it("new rejects invalid nifEmpresa", () => {
    expect(() => Mesa.new("abc", "mesa-1", "sala-1", "Mesa A")).toThrow(
      "NIF da empresa deve ter exatamente 9 dígitos!",
    );
  });

  it("new rejects empty nomeMesa", () => {
    expect(() => Mesa.new(NIF, "mesa-1", "sala-1", "")).toThrow(
      "Nome da mesa não pode ser vazio!",
    );
  });

  it("rebuild restores props", () => {
    const mesa = Mesa.rebuild({
      nifEmpresa: NIF,
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "janela",
    });
    expect(mesa.props.nomeMesa).toBe("Mesa A");
    expect(mesa.props.estado).toBe("livre");
    expect(mesa.props.obs).toBe("janela");
  });

  it("rebuild rejects invalid estado", () => {
    expect(() =>
      Mesa.rebuild({
        nifEmpresa: NIF,
        mesaId: "mesa-1",
        salaId: "sala-1",
        nomeMesa: "Mesa A",
        estado: "reservada",
        obs: "",
      }),
    ).toThrow('Estado da mesa inválido! Esperado: "livre" ou "ocupada".');
  });

  it("allows editing editable keys", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    mesa.set("nomeMesa", "Mesa B");
    mesa.set("estado", "ocupada");
    mesa.set("obs", "terraço");
    expect(mesa.props.nomeMesa).toBe("Mesa B");
    expect(mesa.props.estado).toBe("ocupada");
    expect(mesa.props.obs).toBe("terraço");
  });

  it("rejects empty nomeMesa on set", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    expect(() => mesa.set("nomeMesa", "")).toThrow(
      "Nome da mesa não pode ser vazio!",
    );
  });

  it("rejects invalid estado on set", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    expect(() => mesa.set("estado", "reservada")).toThrow(
      'Estado da mesa inválido! Esperado: "livre" ou "ocupada".',
    );
  });

  it("rejects non-editable keys", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    expect(() => mesa.set("nifEmpresa", "999999990")).toThrow(
      "nifEmpresa não pode ser editado!",
    );
    expect(() => mesa.set("mesaId", "other")).toThrow(
      "mesaId não pode ser editado!",
    );
    expect(() => mesa.set("salaId", "other")).toThrow(
      "salaId não pode ser editado!",
    );
  });

  it("rejects unknown keys", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    expect(() => mesa.set("unknown", "value")).toThrow(
      "Propriedade unknown não encontrada!",
    );
  });

  it("rejects invalid value types", () => {
    const mesa = Mesa.new(NIF, "mesa-1", "sala-1", "Mesa A");
    expect(() => mesa.set("nomeMesa", 123)).toThrow(
      "Tipo de valor inválido para a propriedade nomeMesa. Esperado: string, recebido: number!",
    );
  });
});
