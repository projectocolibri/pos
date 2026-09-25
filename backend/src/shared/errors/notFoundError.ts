import { AppError } from "./appError";

export class NotFoundError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
