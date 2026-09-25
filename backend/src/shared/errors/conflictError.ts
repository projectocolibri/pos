import { AppError } from "./appError";

export class ConflictError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
