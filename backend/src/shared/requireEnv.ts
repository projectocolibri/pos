export type Env = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

/**
 * Reads and validates DB_* environment variables. Throws before any pool is created.
 */
export function requireEnv(env: NodeJS.ProcessEnv = process.env): Env {
  const host = env.HOST?.trim();
  const user = env.USER?.trim();
  const password = env.PASSWORD;
  const database = env.DATABASE?.trim();
  const port = Number(env.PORT);

  if (
    !host ||
    !user ||
    password === undefined ||
    password === "" ||
    !database
  ) {
    throw new Error("HOST, USER, PASSWORD e DATABASE têm de estar definidos!");
  }

  if (!Number.isFinite(port)) {
    throw new Error("PORT tem de ser um número válido!");
  }

  return { host, port, user, password, database };
}
