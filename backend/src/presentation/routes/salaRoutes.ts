import { Router } from "express";
import { container } from "tsyringe";
import { SalaController } from "../controllers";

const salaRoutes = Router();

const salaController = container.resolve(SalaController);

salaRoutes.get("/sala/count", (req, res) => salaController.count(req, res));
salaRoutes.get("/sala/list", (req, res) => salaController.list(req, res));
salaRoutes.get("/sala/load", (req, res) => salaController.load(req, res));
salaRoutes.post("/sala/store", (req, res) => salaController.store(req, res));
salaRoutes.delete("/sala/delete", (req, res) => salaController.delete(req, res));
salaRoutes.post("/sala/new", (req, res) => salaController.new(req, res));
salaRoutes.put("/sala/set", (req, res) => salaController.set(req, res));

export { salaRoutes };
