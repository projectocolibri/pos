import { AppError } from "./appError";

export class ValidationError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
