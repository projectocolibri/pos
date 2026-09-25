import { ValidationError } from "../../../../shared/errors";

export function ensureEditable(value: boolean, fieldName: string): void {
  if (!value) {
    throw new ValidationError(`${fieldName} não pode ser editado!`);
  }
}

export function ensurePropExists(props: object, key: string): void {
  if (!Object.prototype.hasOwnProperty.call(props, key)) {
    throw new ValidationError(`Propriedade ${key} não encontrada!`);
  }
}

export function ensurePropValueType(
  value: any,
  key: string,
  expectedType: string,
): void {
  if (typeof value !== expectedType) {
    throw new ValidationError(
      `Tipo de valor inválido para a propriedade ${key}. Esperado: ${expectedType}, recebido: ${typeof value}!`,
    );
  }
}
