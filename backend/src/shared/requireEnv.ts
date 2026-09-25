export type DbEnv = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type ServerEnv = {
  host: string;
  port: number;
};

/**
 * Reads and validates DB_* environment variables. Throws before any pool is created.
 */
export function requireDbEnv(env: NodeJS.ProcessEnv = process.env): DbEnv {
  const host = env.DB_HOST?.trim();
  const user = env.DB_USER?.trim();
  const password = env.DB_PASSWORD;
  const database = env.DB_NAME?.trim();
  const port = Number(env.DB_PORT);

  if (
    !host ||
    !user ||
    password === undefined ||
    password === "" ||
    !database
  ) {
    throw new Error(
      "DB_HOST, DB_USER, DB_PASSWORD e DB_NAME têm de estar definidos!",
    );
  }

  if (!Number.isFinite(port)) {
    throw new Error("DB_PORT tem de ser um número válido!");
  }

  return { host, port, user, password, database };
}

/**
 * Reads and validates HOST and PORT for the HTTP server.
 */
export function requireServerEnv(
  env: NodeJS.ProcessEnv = process.env,
): ServerEnv {
  const host = env.HOST?.trim();
  const port = Number(env.PORT);

  if (!host) {
    throw new Error("HOST tem de estar definido!");
  }

  if (!Number.isFinite(port)) {
    throw new Error("PORT tem de ser um número válido!");
  }

  return { host, port };
}
