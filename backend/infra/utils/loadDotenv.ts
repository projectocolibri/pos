import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

/** undefined = not searched yet; null = searched and missing */
let cachedEnvPath: string | null | undefined;

/**
 * Resolves the nearest .env path from startDir, caching the result for the process.
 */
export function findDotenv(
  startDir: string = process.cwd(),
): string | undefined {
  if (cachedEnvPath !== undefined) {
    return cachedEnvPath ?? undefined;
  }

  const found = findUp(".env", startDir);
  cachedEnvPath = found ?? null;
  return found;
}

/**
 * Loads the nearest .env found by walking parent directories from startDir.
 */
export function loadDotenv(startDir: string = process.cwd()) {
  const envPath = findDotenv(startDir);
  if (!envPath) {
    throw new Error(
      `.env não encontrada a partir de ${path.resolve(startDir)}!`,
    );
  }
  return dotenv.config({ path: envPath });
}

/**
 * Walks from startDir toward the filesystem root until filename is found.
 */
function findUp(
  filename: string,
  startDir: string = process.cwd(),
): string | undefined {
  let dir = path.resolve(startDir);

  while (true) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}
