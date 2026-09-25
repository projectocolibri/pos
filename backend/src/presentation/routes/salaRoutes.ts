import { Router } from "express";
import { container } from "tsyringe";
import { SalaController } from "../controllers";

const salaRoutes = Router();

salaRoutes.get("/sala/count", (req, res) =>
  container.resolve(SalaController).count(req, res),
);
salaRoutes.get("/sala/list", (req, res) =>
  container.resolve(SalaController).list(req, res),
);
salaRoutes.get("/sala/load", (req, res) =>
  container.resolve(SalaController).load(req, res),
);
salaRoutes.post("/sala/store", (req, res) =>
  container.resolve(SalaController).store(req, res),
);
salaRoutes.delete("/sala/delete", (req, res) =>
  container.resolve(SalaController).delete(req, res),
);
salaRoutes.post("/sala/new", (req, res) =>
  container.resolve(SalaController).new(req, res),
);
salaRoutes.put("/sala/set", (req, res) =>
  container.resolve(SalaController).set(req, res),
);

export { salaRoutes };
