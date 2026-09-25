import { describe, expect, it } from "vitest";
import { requireDbEnv, requireServerEnv } from "../requireEnv";

describe("requireDbEnv", () => {
  const valid = {
    DB_HOST: "localhost",
    DB_PORT: "3306",
    DB_USER: "root",
    DB_PASSWORD: "secret",
    DB_NAME: "pos",
  };

  it("returns parsed credentials when all DB_* vars are set", () => {
    expect(requireDbEnv(valid)).toEqual({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "secret",
      database: "pos",
    });
  });

  it("rejects missing required string vars", () => {
    expect(() => requireDbEnv({ ...valid, DB_HOST: "" })).toThrow(
      "DB_HOST, DB_USER, DB_PASSWORD e DB_NAME têm de estar definidos!",
    );
  });

  it("rejects non-numeric DB_PORT", () => {
    expect(() => requireDbEnv({ ...valid, DB_PORT: "abc" })).toThrow(
      "DB_PORT tem de ser um número válido!",
    );
  });
});

describe("requireServerEnv", () => {
  const valid = {
    HOST: "0.0.0.0",
    PORT: "3000",
  };

  it("returns parsed host and port when set", () => {
    expect(requireServerEnv(valid)).toEqual({
      host: "0.0.0.0",
      port: 3000,
    });
  });

  it("rejects missing HOST", () => {
    expect(() => requireServerEnv({ ...valid, HOST: "" })).toThrow(
      "HOST tem de estar definido!",
    );
  });

  it("rejects non-numeric PORT", () => {
    expect(() => requireServerEnv({ ...valid, PORT: "abc" })).toThrow(
      "PORT tem de ser um número válido!",
    );
  });
});
