import "reflect-metadata";
import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { z } from "zod";
import { Logger } from "../../infra";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors";
import { errorLoggingMiddleware } from "../middleware/loggingMiddleware";

const silent_logger = {
  debug: () => undefined,
  info: () => undefined,
  error: () => undefined,
} as unknown as Logger;

function create_error_app(throw_err: () => never) {
  if (!container.isRegistered(Logger)) {
    container.registerInstance(Logger, silent_logger);
  }

  const app = express();
  app.get("/boom", (_req, _res, next) => {
    try {
      throw_err();
    } catch (err) {
      next(err);
    }
  });
  app.use(errorLoggingMiddleware());
  return app;
}

describe("errorLoggingMiddleware", () => {
  beforeEach(() => {
    container.reset();
    container.registerInstance(Logger, silent_logger);
  });

  it("maps ValidationError to 400", async () => {
    const app = create_error_app(
      () => {
        throw new ValidationError("Campo inválido!");
      },
    );
    const res = await request(app).get("/boom");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Campo inválido!" });
  });

  it("maps NotFoundError to 404", async () => {
    const app = create_error_app(
      () => {
        throw new NotFoundError("Sala não encontrada!");
      },
    );
    const res = await request(app).get("/boom");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Sala não encontrada!" });
  });

  it("maps ConflictError to 409", async () => {
    const app = create_error_app(
      () => {
        throw new ConflictError("Conflito!");
      },
    );
    const res = await request(app).get("/boom");
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: "Conflito!" });
  });

  it("maps ZodError to 400 with issues", async () => {
    const app = create_error_app(() => {
      z.object({ id: z.string().min(1) }).parse({ id: "" });
      throw new Error("unreachable");
    });
    const res = await request(app).get("/boom");
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    expect(res.body.issues).toBeDefined();
  });

  it("maps unexpected errors to 500", async () => {
    const app = create_error_app(() => {
      throw new Error("boom");
    });
    const res = await request(app).get("/boom");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Erro interno do servidor!" });
  });
});
