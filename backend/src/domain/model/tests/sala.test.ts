import { describe, expect, it } from "vitest";
import { Sala } from "../sala";

const NIF = "123456789";

describe("Sala", () => {
  it("new creates sala with nome", () => {
    const sala = Sala.new("sala-1", NIF, "Sala A");
    expect(sala.props).toEqual({
      salaId: "sala-1",
      nifEmpresa: NIF,
      nome: "Sala A",
    });
  });

  it("new rejects empty salaId", () => {
    expect(() => Sala.new("", NIF, "Sala A")).toThrow(
      "ID da sala não pode ser vazio!",
    );
  });

  it("new rejects invalid nifEmpresa", () => {
    expect(() => Sala.new("sala-1", "abc", "Sala A")).toThrow(
      "NIF da empresa deve ter exatamente 9 dígitos!",
    );
  });

  it("new rejects empty nome", () => {
    expect(() => Sala.new("sala-1", NIF, "")).toThrow(
      "Nome da sala não pode ser vazio!",
    );
  });

  it("rebuild restores props", () => {
    const sala = Sala.rebuild({
      salaId: "sala-1",
      nifEmpresa: NIF,
      nome: "Sala A",
    });
    expect(sala.props.nome).toBe("Sala A");
  });

  it("allows editing nome", () => {
    const sala = Sala.new("sala-1", NIF, "Sala A");
    sala.set("nome", "Sala B");
    expect(sala.props.nome).toBe("Sala B");
  });

  it("rejects empty nome on set", () => {
    const sala = Sala.new("sala-1", NIF, "Sala A");
    expect(() => sala.set("nome", "")).toThrow(
      "Nome da sala não pode ser vazio!",
    );
  });

  it("rejects non-editable keys", () => {
    const sala = Sala.new("sala-1", NIF, "Sala A");
    expect(() => sala.set("nifEmpresa", "999999990")).toThrow(
      "nifEmpresa não pode ser editado!",
    );
    expect(() => sala.set("salaId", "other")).toThrow(
      "salaId não pode ser editado!",
    );
  });

  it("rejects unknown keys", () => {
    const sala = Sala.new("sala-1", NIF, "Sala A");
    expect(() => sala.set("unknown", "value")).toThrow(
      "Propriedade unknown não encontrada!",
    );
  });

  it("rejects invalid value types", () => {
    const sala = Sala.new("sala-1", NIF, "Sala A");
    expect(() => sala.set("nome", 123)).toThrow(
      "Tipo de valor inválido para a propriedade nome. Esperado: string, recebido: number!",
    );
  });
});
