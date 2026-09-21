import { defineConfig } from "drizzle-kit";
import { loadDotenv } from "./utils";

loadDotenv();

export default defineConfig({
  dialect: "mysql",
  schema: "./mysql/schema/index.ts",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
});
