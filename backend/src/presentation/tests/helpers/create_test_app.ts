import "reflect-metadata";
import express, { type Express } from "express";
import { container } from "tsyringe";
import { ContaServices, MesaServices, SalaServices } from "../../../app";
import { Logger } from "../../../infra";
import {
  authMiddleware,
  errorLoggingMiddleware,
  requestLoggingMiddleware,
  securityMiddleware,
} from "../../middleware";
import {
  ContaController,
  MesaController,
  SalaController,
} from "../../controllers/index";

export const AUTH_NIF = "999999990";

const silent_logger = {
  debug: () => undefined,
  info: () => undefined,
  error: () => undefined,
} as unknown as Logger;

export type TestServices = {
  salaServices: SalaServices;
  mesaServices: MesaServices;
  contaServices: ContaServices;
};

/**
 * Builds an Express app mirroring createApp, with controllers wired to the
 * provided service doubles so HTTP integration tests do not hit the database.
 * CORS is omitted: Supertest is not a browser and does not need it.
 */
export function create_test_app(services: TestServices): Express {
  if (!container.isRegistered(Logger)) {
    container.registerInstance(Logger, silent_logger);
  }

  const salaController = new SalaController(services.salaServices);
  const mesaController = new MesaController(services.mesaServices);
  const contaController = new ContaController(services.contaServices);

  const app = express();
  app.use(securityMiddleware());
  app.use(requestLoggingMiddleware());
  app.use(authMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/sala/count", (req, res) => salaController.count(req, res));
  app.get("/sala/list", (req, res) => salaController.list(req, res));
  app.get("/sala/load", (req, res) => salaController.load(req, res));
  app.post("/sala/store", (req, res) => salaController.store(req, res));
  app.delete("/sala/delete", (req, res) => salaController.delete(req, res));
  app.post("/sala/new", (req, res) => salaController.new(req, res));
  app.put("/sala/set", (req, res) => salaController.set(req, res));

  app.get("/mesa/count", (req, res) => mesaController.count(req, res));
  app.get("/mesa/list", (req, res) => mesaController.list(req, res));
  app.get("/mesa/load", (req, res) => mesaController.load(req, res));
  app.post("/mesa/store", (req, res) => mesaController.store(req, res));
  app.delete("/mesa/delete", (req, res) => mesaController.delete(req, res));
  app.post("/mesa/new", (req, res) => mesaController.new(req, res));
  app.put("/mesa/set", (req, res) => mesaController.set(req, res));

  app.get("/conta/count", (req, res) => contaController.count(req, res));
  app.get("/conta/list", (req, res) => contaController.list(req, res));
  app.get("/conta/load", (req, res) => contaController.load(req, res));
  app.post("/conta/store", (req, res) => contaController.store(req, res));
  app.delete("/conta/delete", (req, res) => contaController.delete(req, res));
  app.post("/conta/new", (req, res) => contaController.new(req, res));
  app.put("/conta/set", (req, res) => contaController.set(req, res));
  app.post("/conta/addArtigo", (req, res) =>
    contaController.addArtigo(req, res),
  );
  app.delete("/conta/removeArtigo", (req, res) =>
    contaController.removeArtigo(req, res),
  );

  app.use(errorLoggingMiddleware());
  return app;
}

export function auth_headers(nif: string = AUTH_NIF): Record<string, string> {
  return { authentication: JSON.stringify({ nif }) };
}
