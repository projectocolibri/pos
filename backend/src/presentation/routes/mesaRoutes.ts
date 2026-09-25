import { Router } from "express";
import { MesaController } from "../controllers";
import { container } from "tsyringe";

const mesaRoutes = Router();

const mesaController = container.resolve(MesaController);

mesaRoutes.get("/mesa/count", (req, res) => mesaController.count(req, res));
mesaRoutes.get("/mesa/list", (req, res) => mesaController.list(req, res));
mesaRoutes.get("/mesa/load", (req, res) => mesaController.load(req, res));
mesaRoutes.post("/mesa/store", (req, res) => mesaController.store(req, res));
mesaRoutes.delete("/mesa/delete", (req, res) => mesaController.delete(req, res));
mesaRoutes.post("/mesa/new", (req, res) => mesaController.new(req, res));
mesaRoutes.put("/mesa/set", (req, res) => mesaController.set(req, res));

export { mesaRoutes };
