import "reflect-metadata";
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { SalaDTO } from "../../app/dtos";
import {
  AUTH_NIF,
  auth_headers,
  create_test_app,
  stub_conta_services,
  stub_mesa_services,
  stub_sala_services,
} from "./helpers";

describe("SalaController integration", () => {
  const salaServices = stub_sala_services();
  const app = create_test_app({
    salaServices,
    mesaServices: stub_mesa_services(),
    contaServices: stub_conta_services(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/sala/count");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Utilizador não autenticado!" });
  });

  it("GET /sala/count returns count", async () => {
    vi.mocked(salaServices.count).mockResolvedValue(3);

    const res = await request(app).get("/sala/count").set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body).toBe(3);
    expect(salaServices.count).toHaveBeenCalledWith(AUTH_NIF);
  });

  it("GET /sala/list returns salas", async () => {
    const dto = SalaDTO.create({
      salaId: "sala-1",
      nifEmpresa: AUTH_NIF,
      nome: "Sala A",
    });
    vi.mocked(salaServices.list).mockResolvedValue([dto]);

    const res = await request(app).get("/sala/list").set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        salaId: "sala-1",
        nifEmpresa: AUTH_NIF,
        nome: "Sala A",
      },
    ]);
    expect(salaServices.list).toHaveBeenCalledWith(AUTH_NIF);
  });

  it("GET /sala/load returns sala", async () => {
    const dto = SalaDTO.create({
      salaId: "sala-1",
      nifEmpresa: AUTH_NIF,
      nome: "Sala A",
    });
    vi.mocked(salaServices.load).mockResolvedValue(dto);

    const res = await request(app)
      .get("/sala/load")
      .query({ salaId: "sala-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body.salaId).toBe("sala-1");
    expect(salaServices.load).toHaveBeenCalledWith(AUTH_NIF, "sala-1");
  });

  it("GET /sala/load returns 400 when salaId is missing", async () => {
    const res = await request(app).get("/sala/load").set(auth_headers());

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    expect(res.body.issues).toBeDefined();
    expect(salaServices.load).not.toHaveBeenCalled();
  });

  it("POST /sala/store stores sala", async () => {
    const dto = SalaDTO.create({
      salaId: "sala-1",
      nifEmpresa: AUTH_NIF,
      nome: "Sala A",
    });
    vi.mocked(salaServices.store).mockResolvedValue(dto);

    const res = await request(app)
      .post("/sala/store")
      .set(auth_headers())
      .send({ salaDTO: { salaId: "sala-1", nome: "Sala A" } });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Sala A");
    expect(salaServices.store).toHaveBeenCalledTimes(1);
    const [nif, salaDTO] = vi.mocked(salaServices.store).mock.calls[0]!;
    expect(nif).toBe(AUTH_NIF);
    expect(salaDTO.props.salaId).toBe("sala-1");
    expect(salaDTO.props.nifEmpresa).toBe(AUTH_NIF);
  });

  it("POST /sala/store returns 400 for invalid body", async () => {
    const res = await request(app)
      .post("/sala/store")
      .set(auth_headers())
      .send({ salaDTO: { nome: "Sala A" } });

    expect(res.status).toBe(400);
    expect(salaServices.store).not.toHaveBeenCalled();
  });

  it("DELETE /sala/delete deletes sala", async () => {
    vi.mocked(salaServices.delete).mockResolvedValue(undefined);

    const res = await request(app)
      .delete("/sala/delete")
      .set(auth_headers())
      .send({ salaId: "sala-1" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Sala apagada com sucesso!" });
    expect(salaServices.delete).toHaveBeenCalledWith(AUTH_NIF, "sala-1");
  });

  it("DELETE /sala/delete returns 400 for invalid body", async () => {
    const res = await request(app)
      .delete("/sala/delete")
      .set(auth_headers())
      .send({});

    expect(res.status).toBe(400);
    expect(salaServices.delete).not.toHaveBeenCalled();
  });

  it("POST /sala/new creates sala", async () => {
    const dto = SalaDTO.create({
      salaId: "generated",
      nifEmpresa: AUTH_NIF,
      nome: "Sala Nova",
    });
    vi.mocked(salaServices.new).mockResolvedValue(dto);

    const res = await request(app)
      .post("/sala/new")
      .set(auth_headers())
      .send({ nome: "Sala Nova" });

    expect(res.status).toBe(201);
    expect(res.body.salaId).toBe("generated");
    expect(salaServices.new).toHaveBeenCalledWith(AUTH_NIF, "Sala Nova");
  });

  it("PUT /sala/set updates sala property", async () => {
    const dto = SalaDTO.create({
      salaId: "sala-1",
      nifEmpresa: AUTH_NIF,
      nome: "Sala B",
    });
    vi.mocked(salaServices.set).mockResolvedValue(dto);

    const res = await request(app)
      .put("/sala/set")
      .set(auth_headers())
      .send({ salaId: "sala-1", key: "nome", value: "Sala B" });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Sala B");
    expect(salaServices.set).toHaveBeenCalledWith(
      AUTH_NIF,
      "sala-1",
      "nome",
      "Sala B",
    );
  });

  it("PUT /sala/set returns 400 for invalid body", async () => {
    const res = await request(app)
      .put("/sala/set")
      .set(auth_headers())
      .send({ salaId: "sala-1", key: "nome" });

    expect(res.status).toBe(400);
    expect(salaServices.set).not.toHaveBeenCalled();
  });

  it("returns 500 when service throws", async () => {
    vi.mocked(salaServices.count).mockRejectedValue(new Error("boom"));

    const res = await request(app).get("/sala/count").set(auth_headers());

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Erro interno do servidor!" });
  });
});
