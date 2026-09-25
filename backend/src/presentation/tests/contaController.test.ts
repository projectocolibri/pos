import "reflect-metadata";
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { ContaDTO } from "../../app/dtos";
import {
  AUTH_NIF,
  auth_headers,
  create_test_app,
  stub_conta_services,
  stub_mesa_services,
  stub_sala_services,
} from "./helpers";

function sample_conta_dto(
  overrides: Partial<ContaDTO["props"]> = {},
): ContaDTO {
  return ContaDTO.create({
    nifEmpresa: AUTH_NIF,
    contaId: "conta-1",
    mesaId: "mesa-1",
    entidade: 10,
    nome: "Cliente",
    morada: "Rua A",
    codigoPostal: "1000-001",
    localidade: "Lisboa",
    nif: "123456789",
    artigos: [],
    ...overrides,
  });
}

describe("ContaController integration", () => {
  const contaServices = stub_conta_services();
  const app = create_test_app({
    salaServices: stub_sala_services(),
    mesaServices: stub_mesa_services(),
    contaServices,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app)
      .get("/conta/count_conta")
      .query({ mesaId: "mesa-1" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Utilizador não autenticado!" });
  });

  it("GET /conta/count_conta returns count", async () => {
    vi.mocked(contaServices.count_conta).mockResolvedValue(2);

    const res = await request(app)
      .get("/conta/count_conta")
      .query({ mesaId: "mesa-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body).toBe(2);
    expect(contaServices.count_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
    );
  });

  it("GET /conta/count_conta returns 400 when mesaId is missing", async () => {
    const res = await request(app)
      .get("/conta/count_conta")
      .set(auth_headers());

    expect(res.status).toBe(400);
    expect(contaServices.count_conta).not.toHaveBeenCalled();
  });

  it("GET /conta/list_conta returns contas", async () => {
    vi.mocked(contaServices.list_conta).mockResolvedValue([sample_conta_dto()]);

    const res = await request(app)
      .get("/conta/list_conta")
      .query({ mesaId: "mesa-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body[0].contaId).toBe("conta-1");
    expect(contaServices.list_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
    );
  });

  it("GET /conta/load_conta returns conta", async () => {
    vi.mocked(contaServices.load_conta).mockResolvedValue(sample_conta_dto());

    const res = await request(app)
      .get("/conta/load_conta")
      .query({ mesaId: "mesa-1", contaId: "conta-1" })
      .set(auth_headers());

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Cliente");
    expect(contaServices.load_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
      "conta-1",
    );
  });

  it("GET /conta/load_conta returns 400 when contaId is missing", async () => {
    const res = await request(app)
      .get("/conta/load_conta")
      .query({ mesaId: "mesa-1" })
      .set(auth_headers());

    expect(res.status).toBe(400);
    expect(contaServices.load_conta).not.toHaveBeenCalled();
  });

  it("POST /conta/store_conta stores conta", async () => {
    vi.mocked(contaServices.store_conta).mockResolvedValue(sample_conta_dto());

    const res = await request(app)
      .post("/conta/store_conta")
      .set(auth_headers())
      .send({
        contaDTO: {
          contaId: "conta-1",
          mesaId: "mesa-1",
          entidade: 10,
          nome: "Cliente",
          morada: "Rua A",
          codigoPostal: "1000-001",
          localidade: "Lisboa",
          nif: "123456789",
          artigos: [],
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.contaId).toBe("conta-1");
    expect(contaServices.store_conta).toHaveBeenCalledTimes(1);
    const [nif, contaDTO] = vi.mocked(contaServices.store_conta).mock
      .calls[0]!;
    expect(nif).toBe(AUTH_NIF);
    expect(contaDTO.props.nifEmpresa).toBe(AUTH_NIF);
    expect(contaDTO.props.nome).toBe("Cliente");
  });

  it("POST /conta/store_conta stores conta with artigos", async () => {
    const dto = sample_conta_dto();
    vi.mocked(contaServices.store_conta).mockResolvedValue(dto);

    const res = await request(app)
      .post("/conta/store_conta")
      .set(auth_headers())
      .send({
        contaDTO: {
          contaId: "conta-1",
          mesaId: "mesa-1",
          entidade: 10,
          nome: "Cliente",
          morada: "Rua A",
          codigoPostal: "1000-001",
          localidade: "Lisboa",
          nif: "123456789",
          artigos: [
            {
              contaId: "conta-1",
              codigoArtigo: "A1",
              quantidade: 2,
              desconto: 0,
            },
          ],
        },
      });

    expect(res.status).toBe(200);
    const [, contaDTO] = vi.mocked(contaServices.store_conta).mock.calls[0]!;
    expect(contaDTO.props.artigos).toHaveLength(1);
    expect(contaDTO.props.artigos[0]!.props.codigoArtigo).toBe("A1");
    expect(contaDTO.props.artigos[0]!.props.nifEmpresa).toBe(AUTH_NIF);
  });

  it("POST /conta/store_conta returns 400 for invalid body", async () => {
    const res = await request(app)
      .post("/conta/store_conta")
      .set(auth_headers())
      .send({ contaDTO: { contaId: "conta-1" } });

    expect(res.status).toBe(400);
    expect(contaServices.store_conta).not.toHaveBeenCalled();
  });

  it("DELETE /conta/delete_conta deletes conta", async () => {
    vi.mocked(contaServices.delete_conta).mockResolvedValue(undefined);

    const res = await request(app)
      .delete("/conta/delete_conta")
      .set(auth_headers())
      .send({ mesaId: "mesa-1", contaId: "conta-1" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Conta apagada com sucesso!" });
    expect(contaServices.delete_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
      "conta-1",
    );
  });

  it("DELETE /conta/delete_conta returns 400 for invalid body", async () => {
    const res = await request(app)
      .delete("/conta/delete_conta")
      .set(auth_headers())
      .send({ mesaId: "mesa-1" });

    expect(res.status).toBe(400);
    expect(contaServices.delete_conta).not.toHaveBeenCalled();
  });

  it("POST /conta/new_conta creates conta", async () => {
    vi.mocked(contaServices.new_conta).mockResolvedValue(
      sample_conta_dto({ contaId: "generated", nome: "Cliente" }),
    );

    const res = await request(app)
      .post("/conta/new_conta")
      .set(auth_headers())
      .send({ mesaId: "mesa-1", nome: "Cliente" });

    expect(res.status).toBe(201);
    expect(res.body.contaId).toBe("generated");
    expect(contaServices.new_conta).toHaveBeenCalledWith(
      AUTH_NIF,
      "mesa-1",
      "Cliente",
    );
  });

  it("PUT /conta/set_conta updates conta property", async () => {
    vi.mocked(contaServices.set_conta).mockResolvedValue(
      sample_conta_dto({ nome: "Novo" }),
    );

    const res = await request(app)
      .put("/conta/set_conta")
      .set(auth_headers())
      .send({
        mesaId: "mesa-1",
        contaId: "conta-1",
        key: "nome",
        value: "Novo",
      });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Novo");
    expect(contaServices.set_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
      "conta-1",
      "nome",
      "Novo",
    );
  });

  it("PUT /conta/set_conta returns 400 for invalid body", async () => {
    const res = await request(app)
      .put("/conta/set_conta")
      .set(auth_headers())
      .send({
        mesaId: "mesa-1",
        contaId: "conta-1",
        key: "nome",
      });

    expect(res.status).toBe(400);
    expect(contaServices.set_conta).not.toHaveBeenCalled();
  });

  it("POST /conta/add_artigo adds artigo", async () => {
    vi.mocked(contaServices.add_artigo_conta).mockResolvedValue(
      sample_conta_dto(),
    );

    const res = await request(app)
      .post("/conta/add_artigo")
      .set(auth_headers())
      .send({
        mesaId: "mesa-1",
        contaId: "conta-1",
        codigoArtigo: "A1",
      });

    expect(res.status).toBe(200);
    expect(contaServices.add_artigo_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
      "conta-1",
      "A1",
    );
  });

  it("POST /conta/add_artigo returns 400 for invalid body", async () => {
    const res = await request(app)
      .post("/conta/add_artigo")
      .set(auth_headers())
      .send({ mesaId: "mesa-1", contaId: "conta-1" });

    expect(res.status).toBe(400);
    expect(contaServices.add_artigo_conta).not.toHaveBeenCalled();
  });

  it("DELETE /conta/remove_artigo removes artigo", async () => {
    vi.mocked(contaServices.remove_artigo_conta).mockResolvedValue(
      sample_conta_dto(),
    );

    const res = await request(app)
      .delete("/conta/remove_artigo")
      .set(auth_headers())
      .send({
        mesaId: "mesa-1",
        contaId: "conta-1",
        codigoArtigo: "A1",
      });

    expect(res.status).toBe(200);
    expect(contaServices.remove_artigo_conta).toHaveBeenCalledWith(
      AUTH_NIF, "mesa-1",
      "conta-1",
      "A1",
    );
  });

  it("DELETE /conta/remove_artigo returns 400 for invalid body", async () => {
    const res = await request(app)
      .delete("/conta/remove_artigo")
      .set(auth_headers())
      .send({ mesaId: "mesa-1", contaId: "conta-1" });

    expect(res.status).toBe(400);
    expect(contaServices.remove_artigo_conta).not.toHaveBeenCalled();
  });

  it("returns 500 when service throws", async () => {
    vi.mocked(contaServices.count_conta).mockRejectedValue(new Error("boom"));

    const res = await request(app)
      .get("/conta/count_conta")
      .query({ mesaId: "mesa-1" })
      .set(auth_headers());

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Erro interno do servidor!" });
  });
});
