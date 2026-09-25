import { describe, expect, it } from "vitest";
import { requireEnv } from "../requireEnv";

describe("requireEnv", () => {
  const valid = {
    HOST: "localhost",
    PORT: "3306",
    USER: "root",
    PASSWORD: "secret",
    DATABASE: "pos",
  };

  it("returns parsed credentials when all HOST, USER, PASSWORD and DATABASE are set", () => {
    expect(requireEnv(valid)).toEqual({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "secret",
      database: "pos",
    });
  });

  it("rejects missing required string vars", () => {
    expect(() => requireEnv({ ...valid, HOST: "" })).toThrow(
      "HOST, USER, PASSWORD e DATABASE têm de estar definidos!",
    );
  });

  it("rejects non-numeric PORT", () => {
    expect(() => requireEnv({ ...valid, PORT: "abc" })).toThrow(
      "PORT tem de ser um número válido!",
    );
  });
});
