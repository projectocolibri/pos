import "reflect-metadata";
import { container } from "tsyringe";
import { loadDotenv, requireServerEnv } from "./shared";
import { applyMigrations, DatabaseContext, Logger } from "./infra";
import { createApp } from "./createApp";

async function main() {
  loadDotenv();

  const logger = container.resolve(Logger);

  const { host, port } = requireServerEnv();

  const databaseContext = container.resolve(DatabaseContext);

  logger.debug("A aplicar migrações...");
  await applyMigrations(databaseContext.db);
  logger.debug("Migrações aplicadas!");

  logger.debug("A iniciar aplicação...");
  const app = createApp();
  logger.debug("Aplicação iniciada!");

  logger.debug("A iniciar servidor...");
  app.listen(port, host, () => {
    logger.info("Servidor iniciado!", { host, port });
  });
}

main().catch((error) => {
  const logger = container.resolve(Logger);
  logger.error(error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
});
