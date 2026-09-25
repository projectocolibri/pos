import { Router } from "express";
import { container } from "tsyringe";
import { ContaController } from "../controllers";

const contaRoutes = Router();

contaRoutes.get("/conta/count_conta", (req, res) =>
  container.resolve(ContaController).count_conta(req, res),
);
contaRoutes.get("/conta/list_conta", (req, res) =>
  container.resolve(ContaController).list_conta(req, res),
);
contaRoutes.get("/conta/load_conta", (req, res) =>
  container.resolve(ContaController).load_conta(req, res),
);
contaRoutes.post("/conta/store_conta", (req, res) =>
  container.resolve(ContaController).store_conta(req, res),
);
contaRoutes.delete("/conta/delete_conta", (req, res) =>
  container.resolve(ContaController).delete_conta(req, res),
);
contaRoutes.post("/conta/new_conta", (req, res) =>
  container.resolve(ContaController).new_conta(req, res),
);
contaRoutes.put("/conta/set_conta", (req, res) =>
  container.resolve(ContaController).set_conta(req, res),
);
contaRoutes.post("/conta/add_artigo", (req, res) =>
  container.resolve(ContaController).add_artigo_conta(req, res),
);
contaRoutes.delete("/conta/remove_artigo", (req, res) =>
  container.resolve(ContaController).remove_artigo_conta(req, res),
);

export { contaRoutes };
