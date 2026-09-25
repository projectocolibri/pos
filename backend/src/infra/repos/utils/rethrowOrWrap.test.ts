import { describe, expect, it } from "vitest";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors";
import { rethrowOrWrap } from "./rethrowOrWrap";

describe("rethrowOrWrap", () => {
  it("rethrows NotFoundError unchanged", () => {
    const err = new NotFoundError("não encontrado");
    expect(() => rethrowOrWrap(err, "wrap")).toThrow(err);
  });

  it("rethrows ValidationError unchanged", () => {
    const err = new ValidationError("inválido");
    expect(() => rethrowOrWrap(err, "wrap")).toThrow(err);
  });

  it("rethrows ConflictError unchanged", () => {
    const err = new ConflictError("conflito");
    expect(() => rethrowOrWrap(err, "wrap")).toThrow(err);
  });

  it("maps MySQL 1062 to ConflictError", () => {
    expect(() =>
      rethrowOrWrap({ errno: 1062, message: "Duplicate" }, "wrap"),
    ).toThrow(ConflictError);
    try {
      rethrowOrWrap({ errno: 1062 }, "wrap");
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictError);
      expect((err as ConflictError).message).toBe("Registo já existente!");
      expect((err as ConflictError).cause).toEqual({ errno: 1062 });
    }
  });

  it("maps MySQL 1452 to NotFoundError", () => {
    try {
      rethrowOrWrap({ errno: 1452 }, "wrap");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toBe(
        "Registo referenciado não encontrado!",
      );
    }
  });

  it("maps MySQL 1451 to ConflictError", () => {
    try {
      rethrowOrWrap({ errno: 1451 }, "wrap");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictError);
      expect((err as ConflictError).message).toBe(
        "Não é possível eliminar: existem registos dependentes!",
      );
    }
  });

  it("maps errno nested under cause", () => {
    const wrapped = new Error("outer", { cause: { errno: 1062 } });
    try {
      rethrowOrWrap(wrapped, "wrap");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictError);
    }
  });

  it("wraps unknown errors with message and cause", () => {
    const original = new Error("db down");
    try {
      rethrowOrWrap(original, "Erro ao armazenar conta!");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).not.toBeInstanceOf(ConflictError);
      expect((err as Error).message).toBe("Erro ao armazenar conta!");
      expect((err as Error).cause).toBe(original);
    }
  });
});
