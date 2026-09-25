import { container } from "tsyringe";
import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  RequestHandler,
} from "express";
import { Logger } from "../../infra";
import { ZodError } from "zod";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors";

/**
 * Logs each finished HTTP request with method, path, status and duration.
 */
export function requestLoggingMiddleware(): RequestHandler {
  const logger = container.resolve(Logger);

  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on("finish", () => {
      logger.debug("Pedido HTTP", {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });

    next();
  };
}

/**
 * Logs unhandled errors and maps typed errors to HTTP status codes.
 */
export function errorLoggingMiddleware(): ErrorRequestHandler {
  const logger = container.resolve(Logger);

  return (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (err instanceof ZodError) {
      if (!res.headersSent) {
        res.status(400).json({ message: err.message, issues: err.issues });
      }
      return;
    }

    if (err instanceof ValidationError) {
      if (!res.headersSent) {
        res.status(400).json({ message: err.message });
      }
      return;
    }

    if (err instanceof NotFoundError) {
      if (!res.headersSent) {
        res.status(404).json({ message: err.message });
      }
      return;
    }

    if (err instanceof ConflictError) {
      if (!res.headersSent) {
        res.status(409).json({ message: err.message });
      }
      return;
    }

    logger.error(err, {
      method: req.method,
      path: req.originalUrl,
    });

    if (res.headersSent) {
      next(err);
      return;
    }

    res.status(500).json({ message: "Erro interno do servidor!" });
  };
}
