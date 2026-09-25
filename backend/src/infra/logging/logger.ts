import { createRequire } from "node:module";
import pino, { type Logger as PinoLogger } from "pino";
import { injectable } from "tsyringe";

const require = createRequire(import.meta.url);

function createPinoLogger(): PinoLogger {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const pretty = require("pino-pretty");
    return pino(
      { level: "debug" },
      pretty({ colorize: true, translateTime: "HH:MM:ss" }),
    );
  }

  return pino({ level: "info" });
}

@injectable()
export class Logger {
  private readonly logger: PinoLogger;

  public constructor() {
    this.logger = createPinoLogger();
  }

  debug(message: string, meta?: object): void {
    if (meta !== undefined) {
      this.logger.debug(meta, message);
      return;
    }
    this.logger.debug(message);
  }

  info(message: string, meta?: object): void {
    if (meta !== undefined) {
      this.logger.info(meta, message);
      return;
    }
    this.logger.info(message);
  }

  error(error: Error, meta?: object): void {
    if (meta !== undefined) {
      this.logger.error({ ...meta, err: error }, error.message);
      return;
    }
    this.logger.error(error);
  }
}
