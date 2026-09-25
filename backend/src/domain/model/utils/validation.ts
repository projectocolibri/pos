import { NotFoundError, ValidationError } from "../../../shared/errors";

export type MesaEstado = "livre" | "ocupada";

export function ensureNonEmpty(value: string, fieldName: string): void {
  if (!value || value.trim() === "") {
    throw new ValidationError(`${fieldName} não pode ser vazio!`);
  }
}

export function ensureNif(value: string, fieldName: string): void {
  if (!/^\d{9}$/.test(value)) {
    throw new ValidationError(
      `${fieldName} deve ter exatamente 9 dígitos!`,
    );
  }
}

export function ensureMesaEstado(value: string): asserts value is MesaEstado {
  if (value !== "livre" && value !== "ocupada") {
    throw new ValidationError(
      'Estado da mesa inválido! Esperado: "livre" ou "ocupada".',
    );
  }
}

export function ensurePositive(value: number, fieldName: string): void {
  if (value < 0) {
    throw new ValidationError(`${fieldName} deve ser maior ou igual a 0!`);
  }
}

export function ensureBiggerThanZero(value: number, fieldName: string): void {
  if (value <= 0) {
    throw new ValidationError(`${fieldName} deve ser maior que 0!`);
  }
}

export function ensureIsFound(index: number, message: string): void {
  if (index < 0) {
    throw new NotFoundError(message);
  }
}
