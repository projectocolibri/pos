import { Router } from "express";
import { container } from "tsyringe";
import { ContaController } from "../controllers";

const contaRoutes = Router();

const contaController = container.resolve(ContaController);

contaRoutes.get("/conta/count_conta", (req, res) =>
  contaController.count_conta(req, res),
);
contaRoutes.get("/conta/list_conta", (req, res) =>
  contaController.list_conta(req, res),
);
contaRoutes.get("/conta/load_conta", (req, res) =>
  contaController.load_conta(req, res),
);
contaRoutes.post("/conta/store_conta", (req, res) =>
  contaController.store_conta(req, res),
);
contaRoutes.delete("/conta/delete_conta", (req, res) =>
  contaController.delete_conta(req, res),
);
contaRoutes.post("/conta/new_conta", (req, res) =>
  contaController.new_conta(req, res),
);
contaRoutes.put("/conta/set_conta", (req, res) =>
  contaController.set_conta(req, res),
);
contaRoutes.post("/conta/add_artigo", (req, res) =>
  contaController.add_artigo_conta(req, res),
);
contaRoutes.delete("/conta/remove_artigo", (req, res) =>
  contaController.remove_artigo_conta(req, res),
);

export { contaRoutes };
