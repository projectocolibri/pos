import pino from "pino";
import { injectable } from "tsyringe";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: isDev ? "debug" : "info",
});

@injectable()
export class Logger {
  debug(message: string, meta?: object): void {
    if (meta !== undefined) {
      logger.debug(meta, message);
      return;
    }
    logger.debug(message);
  }

  info(message: string, meta?: object): void {
    if (meta !== undefined) {
      logger.info(meta, message);
      return;
    }
    logger.info(message);
  }

  error(error: Error, meta?: object): void {
    if (meta !== undefined) {
      logger.error({ ...meta, err: error }, error.message);
      return;
    }
    logger.error(error);
  }
}
