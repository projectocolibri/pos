import { describe, expect, it } from "vitest";
import { Conta } from "../conta";

const NIF = "123456789";

describe("Conta", () => {
  it("new creates conta with defaults", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(conta.props).toEqual({
      nifEmpresa: NIF,
      contaId: "conta-1",
      mesaId: "mesa-1",
      entidade: 0,
      nome: "Cliente",
      morada: "",
      codigoPostal: "",
      localidade: "",
      nif: "",
    });
    expect(conta.getArtigos()).toEqual([]);
    expect(conta.props).not.toHaveProperty("artigos");
  });

  it("new rejects empty contaId", () => {
    expect(() => Conta.new(NIF, "", "mesa-1", "Cliente")).toThrow(
      "ID da conta não pode ser vazio!",
    );
  });

  it("new rejects empty mesaId", () => {
    expect(() => Conta.new(NIF, "conta-1", "", "Cliente")).toThrow(
      "ID da mesa não pode ser vazio!",
    );
  });

  it("new rejects invalid nifEmpresa", () => {
    expect(() => Conta.new("abc", "conta-1", "mesa-1", "Cliente")).toThrow(
      "NIF da empresa deve ter exatamente 9 dígitos!",
    );
  });

  it("new rejects empty nome", () => {
    expect(() => Conta.new(NIF, "conta-1", "mesa-1", "")).toThrow(
      "Nome da conta não pode ser vazio!",
    );
  });

  it("rebuild restores props", () => {
    const conta = Conta.rebuild({
      nifEmpresa: NIF,
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
    expect(conta.props.entidade).toBe(10);
    expect(conta.props.nome).toBe("Cliente");
    expect(conta.props.morada).toBe("Rua A");
    expect(conta.props.codigoPostal).toBe("1000-001");
    expect(conta.props.localidade).toBe("Lisboa");
    expect(conta.props.nif).toBe("123456789");
  });

  it("rebuild rejects negative entidade", () => {
    expect(() =>
      Conta.rebuild({
        nifEmpresa: NIF,
        contaId: "conta-1",
        mesaId: "mesa-1",
        entidade: -1,
        nome: "Cliente",
        morada: "",
        codigoPostal: "",
        localidade: "",
        nif: "",
        artigos: [],
      }),
    ).toThrow("Entidade deve ser maior ou igual a 0!");
  });

  it("rebuild rejects invalid customer nif", () => {
    expect(() =>
      Conta.rebuild({
        nifEmpresa: NIF,
        contaId: "conta-1",
        mesaId: "mesa-1",
        entidade: 0,
        nome: "Cliente",
        morada: "",
        codigoPostal: "",
        localidade: "",
        nif: "123",
        artigos: [],
      }),
    ).toThrow("NIF deve ter exatamente 9 dígitos!");
  });

  it("allows editing editable keys", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    conta.set("entidade", 5);
    conta.set("nome", "Cliente B");
    conta.set("morada", "Rua A");
    conta.set("codigoPostal", "1000-001");
    conta.set("localidade", "Lisboa");
    conta.set("nif", "987654321");
    expect(conta.props.entidade).toBe(5);
    expect(conta.props.nome).toBe("Cliente B");
    expect(conta.props.morada).toBe("Rua A");
    expect(conta.props.codigoPostal).toBe("1000-001");
    expect(conta.props.localidade).toBe("Lisboa");
    expect(conta.props.nif).toBe("987654321");
  });

  it("rejects empty nome on set", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(() => conta.set("nome", "")).toThrow(
      "Nome da conta não pode ser vazio!",
    );
  });

  it("rejects invalid nif on set", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(() => conta.set("nif", "12")).toThrow(
      "NIF deve ter exatamente 9 dígitos!",
    );
  });

  it("rejects non-editable keys", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(() => conta.set("nifEmpresa", "999999990")).toThrow(
      "nifEmpresa não pode ser editado!",
    );
    expect(() => conta.set("contaId", "other")).toThrow(
      "contaId não pode ser editado!",
    );
    expect(() => conta.set("mesaId", "other")).toThrow(
      "mesaId não pode ser editado!",
    );
  });

  it("rejects unknown keys", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(() => conta.set("unknown", "value")).toThrow(
      "Propriedade unknown não encontrada!",
    );
    expect(() => conta.set("artigos", [])).toThrow(
      "Propriedade artigos não encontrada!",
    );
  });

  it("rejects invalid value types", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(() => conta.set("nome", 123)).toThrow(
      "Tipo de valor inválido para a propriedade nome. Esperado: string, recebido: number!",
    );
    expect(() => conta.set("entidade", "5")).toThrow(
      "Tipo de valor inválido para a propriedade entidade. Esperado: number, recebido: string!",
    );
  });

  it("addArtigo, getArtigo and removeArtigo manage artigos", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");

    conta.addArtigo("A1");
    expect(conta.getArtigo("A1")?.props.codigoArtigo).toBe("A1");
    expect(conta.getArtigos()).toHaveLength(1);

    conta.removeArtigo("A1");
    expect(conta.getArtigo("A1")).toBeUndefined();
    expect(conta.getArtigos()).toHaveLength(0);
  });

  it("addArtigo increments quantidade when codigoArtigo already exists", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");

    conta.addArtigo("A1");
    conta.addArtigo("A1");

    expect(conta.getArtigos()).toHaveLength(1);
    expect(conta.getArtigo("A1")?.props.quantidade).toBe(2);
  });

  it("removeArtigo throws when artigo is missing", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(() => conta.removeArtigo("MISSING")).toThrow(
      "Artigo não encontrado!",
    );
  });

  it("getArtigo returns undefined when artigo is missing", () => {
    const conta = Conta.new(NIF, "conta-1", "mesa-1", "Cliente");
    expect(conta.getArtigo("MISSING")).toBeUndefined();
  });
});
