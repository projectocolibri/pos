import { container } from "tsyringe";
import {
  ContaRepo,
  DatabaseContext,
  IdGenerator,
  Logger,
  MesaRepo,
  SalaRepo,
} from "../infra";
import {
  ContaController,
  MesaController,
  SalaController,
} from "../presentation/controllers";
import { ContaServices, MesaServices, SalaServices } from "../app";
import { TOKENS } from "./tokens";

container.registerSingleton(DatabaseContext);
container.registerSingleton(TOKENS.ISalaRepo, SalaRepo);
container.registerSingleton(TOKENS.IMesaRepo, MesaRepo);
container.registerSingleton(TOKENS.IContaRepo, ContaRepo);
container.registerSingleton(TOKENS.IIdGenerator, IdGenerator);
container.registerSingleton(ContaServices);
container.registerSingleton(MesaServices);
container.registerSingleton(SalaServices);
container.registerSingleton(ContaController);
container.registerSingleton(MesaController);
container.registerSingleton(SalaController);
container.registerSingleton(Logger);
