import "reflect-metadata";
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { MesaDTO } from "../../app/dtos";
import {
  AUTH_NIF,
  auth_headers,
  create_test_app,
  stub_conta_services,
  stub_mesa_services,
  stub_sala_services,
} from "./helpers";

describe("MesaController integration", () => {
  const mesaServices = stub_mesa_services();
  const app = create_test_app({
    salaServices: stub_sala_services(),
    mesaServices,
    contaServices: stub_conta_services(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app)
      .get("/mesa/count")
      .query({ salaId: "sala-1" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Utilizador não autenticado!" });
  });

  it("GET /mesa/count returns count", async () => {
    vi.mocked(mesaServices.count).mockResolvedValue(4);

    const res = await request(app)
      .get("/mesa/count")
      .query({ salaId: "sala-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body).toBe(4);
    expect(mesaServices.count).toHaveBeenCalledWith(AUTH_NIF, "sala-1");
  });

  it("GET /mesa/count returns 400 when salaId is missing", async () => {
    const res = await request(app).get("/mesa/count").set(auth_headers());

    expect(res.status).toBe(400);
    expect(mesaServices.count).not.toHaveBeenCalled();
  });

  it("GET /mesa/list returns mesas", async () => {
    const dto = MesaDTO.create({
      nifEmpresa: AUTH_NIF,
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "",
    });
    vi.mocked(mesaServices.list).mockResolvedValue([dto]);

    const res = await request(app)
      .get("/mesa/list")
      .query({ salaId: "sala-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body[0].mesaId).toBe("mesa-1");
    expect(mesaServices.list).toHaveBeenCalledWith(AUTH_NIF, "sala-1");
  });

  it("GET /mesa/load returns mesa", async () => {
    const dto = MesaDTO.create({
      nifEmpresa: AUTH_NIF,
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "janela",
    });
    vi.mocked(mesaServices.load).mockResolvedValue(dto);

    const res = await request(app)
      .get("/mesa/load")
      .query({ salaId: "sala-1", mesaId: "mesa-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body.nomeMesa).toBe("Mesa A");
    expect(mesaServices.load).toHaveBeenCalledWith(
      AUTH_NIF,
      "sala-1",
      "mesa-1",
    );
  });

  it("GET /mesa/load returns 400 when mesaId is missing", async () => {
    const res = await request(app)
      .get("/mesa/load")
      .query({ salaId: "sala-1" })
      .set(auth_headers());

    expect(res.status).toBe(400);
    expect(mesaServices.load).not.toHaveBeenCalled();
  });

  it("POST /mesa/store stores mesa", async () => {
    const dto = MesaDTO.create({
      nifEmpresa: AUTH_NIF,
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa A",
      estado: "livre",
      obs: "janela",
    });
    vi.mocked(mesaServices.store).mockResolvedValue(dto);

    const res = await request(app)
      .post("/mesa/store")
      .set(auth_headers())
      .send({
        mesaDTO: {
          mesaId: "mesa-1",
          salaId: "sala-1",
          nomeMesa: "Mesa A",
          estado: "livre",
          obs: "janela",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.mesaId).toBe("mesa-1");
    expect(mesaServices.store).toHaveBeenCalledTimes(1);
    const [nif, mesaDTO] = vi.mocked(mesaServices.store).mock.calls[0]!;
    expect(nif).toBe(AUTH_NIF);
    expect(mesaDTO.props.nifEmpresa).toBe(AUTH_NIF);
    expect(mesaDTO.props.nomeMesa).toBe("Mesa A");
  });

  it("POST /mesa/store returns 400 for invalid body", async () => {
    const res = await request(app)
      .post("/mesa/store")
      .set(auth_headers())
      .send({ mesaDTO: { mesaId: "mesa-1" } });

    expect(res.status).toBe(400);
    expect(mesaServices.store).not.toHaveBeenCalled();
  });

  it("DELETE /mesa/delete deletes mesa", async () => {
    vi.mocked(mesaServices.delete).mockResolvedValue(undefined);

    const res = await request(app)
      .delete("/mesa/delete")
      .set(auth_headers())
      .send({ salaId: "sala-1", mesaId: "mesa-1" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Mesa apagada com sucesso!" });
    expect(mesaServices.delete).toHaveBeenCalledWith(
      AUTH_NIF,
      "sala-1",
      "mesa-1",
    );
  });

  it("DELETE /mesa/delete returns 400 for invalid body", async () => {
    const res = await request(app)
      .delete("/mesa/delete")
      .set(auth_headers())
      .send({ salaId: "sala-1" });

    expect(res.status).toBe(400);
    expect(mesaServices.delete).not.toHaveBeenCalled();
  });

  it("POST /mesa/new creates mesa", async () => {
    const dto = MesaDTO.create({
      nifEmpresa: AUTH_NIF,
      mesaId: "generated",
      salaId: "sala-1",
      nomeMesa: "Mesa Nova",
      estado: "livre",
      obs: "",
    });
    vi.mocked(mesaServices.new).mockResolvedValue(dto);

    const res = await request(app)
      .post("/mesa/new")
      .set(auth_headers())
      .send({ salaId: "sala-1", nomeMesa: "Mesa Nova" });

    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe("generated");
    expect(mesaServices.new).toHaveBeenCalledWith(
      AUTH_NIF,
      "sala-1",
      "Mesa Nova",
    );
  });

  it("PUT /mesa/set updates mesa property", async () => {
    const dto = MesaDTO.create({
      nifEmpresa: AUTH_NIF,
      mesaId: "mesa-1",
      salaId: "sala-1",
      nomeMesa: "Mesa B",
      estado: "ocupada",
      obs: "",
    });
    vi.mocked(mesaServices.set).mockResolvedValue(dto);

    const res = await request(app).put("/mesa/set").set(auth_headers()).send({
      salaId: "sala-1",
      mesaId: "mesa-1",
      key: "nomeMesa",
      value: "Mesa B",
    });

    expect(res.status).toBe(200);
    expect(res.body.nomeMesa).toBe("Mesa B");
    expect(mesaServices.set).toHaveBeenCalledWith(
      AUTH_NIF,
      "sala-1",
      "mesa-1",
      "nomeMesa",
      "Mesa B",
    );
  });

  it("PUT /mesa/set returns 400 for invalid body", async () => {
    const res = await request(app)
      .put("/mesa/set")
      .set(auth_headers())
      .send({ salaId: "sala-1", mesaId: "mesa-1", key: "nomeMesa" });

    expect(res.status).toBe(400);
    expect(mesaServices.set).not.toHaveBeenCalled();
  });

  it("returns 500 when service throws", async () => {
    vi.mocked(mesaServices.count).mockRejectedValue(new Error("boom"));

    const res = await request(app)
      .get("/mesa/count")
      .query({ salaId: "sala-1" })
      .set(auth_headers());

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Erro interno do servidor!" });
  });
});
