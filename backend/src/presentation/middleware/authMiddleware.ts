import { Request, Response, NextFunction } from "express";

/**
 * Sets `req.nifEmpresa` from the JSON field `nif` in the `authentication` header.
 * Responds 401 when the header is missing or invalid.
 *
 * This is not cryptographic authentication: the header is not signed or verified here.
 * `nif` is trusted only because a private/upstream auth gateway is expected to set it
 * before the request reaches this API. Does not read or verify the `authorization` header.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const raw = req.headers.authentication;

  if (!raw) {
    res.status(401).json({ message: "Utilizador não autenticado!" });
    return;
  }

  try {
    const token = JSON.parse(raw as string) as { nif?: unknown };
    if (typeof token.nif !== "string" || token.nif.trim() === "") {
      res.status(401).json({ message: "Token inválido!" });
      return;
    }
    req.nifEmpresa = token.nif;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido!" });
  }
};
