import { z, ZodError, ZodType } from "zod";
import { Request } from "express";

export function parse_query<T extends ZodType>(
  req: Request,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(normalize_query(req.query));
  if (!result.success) {
    throw new ZodError(result.error.issues);
  }
  return result.data;
}

/**
 * Flattens Express query values (string | string[]) to a single string per key.
 */
function normalize_query(
  query: Request["query"],
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      const first = value[0];
      result[key] = typeof first === "string" ? first : undefined;
    } else if (typeof value === "string") {
      result[key] = value;
    } else {
      result[key] = undefined;
    }
  }
  return result;
}
