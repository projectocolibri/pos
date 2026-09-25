import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";

/**
 * Loads dist/.env beside the running bundle. Throws if missing.
 */
export function loadDotenv() {
  const envPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    ".env",
  );
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env não encontrado em ${envPath}`);
  }
  return dotenv.config({ path: envPath });
}
