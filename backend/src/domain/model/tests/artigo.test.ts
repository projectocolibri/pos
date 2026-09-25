import { describe, expect, it } from "vitest";
import { Artigo } from "../artigo";

const NIF = "123456789";

describe("Artigo", () => {
  it("new creates artigo with defaults", () => {
    const artigo = Artigo.new(NIF, "conta-1", "A1");
    expect(artigo.props).toEqual({
      nifEmpresa: NIF,
      contaId: "conta-1",
      codigoArtigo: "A1",
      quantidade: 1,
      desconto: 0,
    });
  });

  it("new rejects invalid nifEmpresa", () => {
    expect(() => Artigo.new("abc", "conta-1", "A1")).toThrow(
      "NIF da empresa deve ter exatamente 9 dígitos!",
    );
  });

  it("new rejects empty contaId", () => {
    expect(() => Artigo.new(NIF, "", "A1")).toThrow(
      "ID da conta não pode ser vazio!",
    );
  });

  it("new rejects empty codigoArtigo", () => {
    expect(() => Artigo.new(NIF, "conta-1", "")).toThrow(
      "Código do artigo não pode ser vazio!",
    );
  });

  it("rebuild restores props", () => {
    const artigo = Artigo.rebuild({
      nifEmpresa: NIF,
      contaId: "conta-1",
      codigoArtigo: "A1",
      quantidade: 3,
      desconto: 10,
    });
    expect(artigo.props.quantidade).toBe(3);
    expect(artigo.props.desconto).toBe(10);
  });

  it("rebuild rejects quantidade less than or equal to zero", () => {
    expect(() =>
      Artigo.rebuild({
        nifEmpresa: NIF,
        contaId: "conta-1",
        codigoArtigo: "A1",
        quantidade: 0,
        desconto: 0,
      }),
    ).toThrow("Quantidade do artigo deve ser maior que 0!");
  });

  it("rebuild rejects negative desconto", () => {
    expect(() =>
      Artigo.rebuild({
        nifEmpresa: NIF,
        contaId: "conta-1",
        codigoArtigo: "A1",
        quantidade: 1,
        desconto: -1,
      }),
    ).toThrow("Desconto do artigo deve ser maior ou igual a 0!");
  });

  it("allows editing editable keys", () => {
    const artigo = Artigo.new(NIF, "conta-1", "A1");
    artigo.set("quantidade", 5);
    artigo.set("desconto", 15);
    expect(artigo.props.quantidade).toBe(5);
    expect(artigo.props.desconto).toBe(15);
  });

  it("rejects non-editable keys", () => {
    const artigo = Artigo.new(NIF, "conta-1", "A1");
    expect(() => artigo.set("nifEmpresa", "999999990")).toThrow(
      "nifEmpresa não pode ser editado!",
    );
    expect(() => artigo.set("contaId", "other")).toThrow(
      "contaId não pode ser editado!",
    );
    expect(() => artigo.set("codigoArtigo", "A2")).toThrow(
      "codigoArtigo não pode ser editado!",
    );
  });

  it("rejects unknown keys", () => {
    const artigo = Artigo.new(NIF, "conta-1", "A1");
    expect(() => artigo.set("unknown", "value")).toThrow(
      "Propriedade unknown não encontrada!",
    );
  });

  it("rejects invalid value types", () => {
    const artigo = Artigo.new(NIF, "conta-1", "A1");
    expect(() => artigo.set("quantidade", "5")).toThrow(
      "Tipo de valor inválido para a propriedade quantidade. Esperado: number, recebido: string!",
    );
    expect(() => artigo.set("desconto", "10")).toThrow(
      "Tipo de valor inválido para a propriedade desconto. Esperado: number, recebido: string!",
    );
  });
});
