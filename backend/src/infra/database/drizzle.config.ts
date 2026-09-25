import { defineConfig } from "drizzle-kit";
import { requireDbEnv } from "../../shared";

const { host, port, user, password, database } = requireDbEnv();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/infra/database/mysql/schema",
  out: "./migrations",
  dbCredentials: {
    host,
    port,
    user,
    password,
    database,
  },
});
