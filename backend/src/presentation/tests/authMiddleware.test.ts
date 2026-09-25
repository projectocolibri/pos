import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import {
  auth_headers,
  create_test_app,
  stub_conta_services,
  stub_mesa_services,
  stub_sala_services,
} from "./helpers";

describe("authMiddleware integration", () => {
  const app = create_test_app({
    salaServices: stub_sala_services(),
    mesaServices: stub_mesa_services(),
    contaServices: stub_conta_services(),
  });

  it("returns 401 when authentication header is missing", async () => {
    const res = await request(app).get("/sala/count");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Utilizador não autenticado!" });
  });

  it("returns 401 when authentication header is not JSON", async () => {
    const res = await request(app)
      .get("/sala/count")
      .set({ authentication: "not-json" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Token inválido!" });
  });

  it("returns 401 when nif is missing", async () => {
    const res = await request(app)
      .get("/sala/count")
      .set({ authentication: JSON.stringify({}) });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Token inválido!" });
  });

  it("returns 401 when nif is empty", async () => {
    const res = await request(app)
      .get("/sala/count")
      .set({ authentication: JSON.stringify({ nif: "   " }) });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Token inválido!" });
  });

  it("returns 401 when nif is not a string", async () => {
    const res = await request(app)
      .get("/sala/count")
      .set({ authentication: JSON.stringify({ nif: 123 }) });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Token inválido!" });
  });

  it("accepts valid authentication header", async () => {
    const salaServices = stub_sala_services({
      count: vi.fn().mockResolvedValue(0),
    });
    const app = create_test_app({
      salaServices,
      mesaServices: stub_mesa_services(),
      contaServices: stub_conta_services(),
    });

    const res = await request(app).get("/sala/count").set(auth_headers());
    expect(res.status).toBe(200);
    expect(res.body).toBe(0);
  });
});
