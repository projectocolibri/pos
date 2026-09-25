import { Router } from "express";
import { container } from "tsyringe";
import { ContaController } from "../controllers";

const contaRoutes = Router();

contaRoutes.get("/conta/count", (req, res) =>
  container.resolve(ContaController).count(req, res),
);
contaRoutes.get("/conta/list", (req, res) =>
  container.resolve(ContaController).list(req, res),
);
contaRoutes.get("/conta/load", (req, res) =>
  container.resolve(ContaController).load(req, res),
);
contaRoutes.post("/conta/store", (req, res) =>
  container.resolve(ContaController).store(req, res),
);
contaRoutes.delete("/conta/delete", (req, res) =>
  container.resolve(ContaController).delete(req, res),
);
contaRoutes.post("/conta/new", (req, res) =>
  container.resolve(ContaController).new(req, res),
);
contaRoutes.put("/conta/set", (req, res) =>
  container.resolve(ContaController).set(req, res),
);
contaRoutes.post("/conta/addArtigo", (req, res) =>
  container.resolve(ContaController).addArtigo(req, res),
);
contaRoutes.delete("/conta/removeArtigo", (req, res) =>
  container.resolve(ContaController).removeArtigo(req, res),
);

export { contaRoutes };
