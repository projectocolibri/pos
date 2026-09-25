import cors from "cors";

/**
 * Builds CORS middleware: `CORS_ORIGIN` required.
 */
export function corsMiddleware() {
  const raw = process.env.CORS_ORIGIN;
  if (!raw?.trim()) {
    throw new Error("CORS_ORIGIN em falta!");
  }

  return cors({ origin: raw });
}
