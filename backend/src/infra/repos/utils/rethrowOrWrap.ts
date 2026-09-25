import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors";

const MYSQL_DUP_ENTRY = 1062;
const MYSQL_ROW_IS_REFERENCED = 1451;
const MYSQL_NO_REFERENCED_ROW = 1452;

function mysql_errno(err: unknown): number | undefined {
  let current: unknown = err;
  for (let depth = 0; depth < 5 && current != null; depth++) {
    if (typeof current === "object" && "errno" in current) {
      const errno = (current as { errno: unknown }).errno;
      if (typeof errno === "number") {
        return errno;
      }
    }
    if (
      typeof current === "object" &&
      current !== null &&
      "cause" in current
    ) {
      current = (current as { cause: unknown }).cause;
      continue;
    }
    break;
  }
  return undefined;
}

export function rethrowOrWrap(err: unknown, message: string): never {
  if (
    err instanceof NotFoundError ||
    err instanceof ValidationError ||
    err instanceof ConflictError ||
    err instanceof AppError
  ) {
    throw err;
  }

  const errno = mysql_errno(err);
  if (errno === MYSQL_DUP_ENTRY) {
    throw new ConflictError("Registo já existente!", { cause: err });
  }
  if (errno === MYSQL_NO_REFERENCED_ROW) {
    throw new NotFoundError("Registo referenciado não encontrado!", {
      cause: err,
    });
  }
  if (errno === MYSQL_ROW_IS_REFERENCED) {
    throw new ConflictError(
      "Não é possível eliminar: existem registos dependentes!",
      { cause: err },
    );
  }

  throw new Error(message, { cause: err });
}
