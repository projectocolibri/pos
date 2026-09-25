import { z, ZodError, ZodType } from "zod";
import { Request } from "express";

export function parse_body<T extends ZodType>(
  req: Request,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    throw new ZodError(result.error.issues);
  }
  return result.data;
}
