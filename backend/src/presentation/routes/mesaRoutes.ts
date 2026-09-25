import { Router } from "express";
import { MesaController } from "../controllers";
import { container } from "tsyringe";

const mesaRoutes = Router();

mesaRoutes.get("/mesa/count", (req, res) =>
  container.resolve(MesaController).count(req, res),
);
mesaRoutes.get("/mesa/list", (req, res) =>
  container.resolve(MesaController).list(req, res),
);
mesaRoutes.get("/mesa/load", (req, res) =>
  container.resolve(MesaController).load(req, res),
);
mesaRoutes.post("/mesa/store", (req, res) =>
  container.resolve(MesaController).store(req, res),
);
mesaRoutes.delete("/mesa/delete", (req, res) =>
  container.resolve(MesaController).delete(req, res),
);
mesaRoutes.post("/mesa/new", (req, res) =>
  container.resolve(MesaController).new(req, res),
);
mesaRoutes.put("/mesa/set", (req, res) =>
  container.resolve(MesaController).set(req, res),
);

export { mesaRoutes };
