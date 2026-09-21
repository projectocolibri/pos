import { container } from "tsyringe";
import { DatabaseContext, SalaRepo } from "../infra";
import { TOKENS } from "./tokens";
import { ISalaRepo } from "../domain";

container.registerSingleton(DatabaseContext);
container.registerSingleton<ISalaRepo>(TOKENS.SALA_REPO, SalaRepo);
