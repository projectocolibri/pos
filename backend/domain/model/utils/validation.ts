export function ensureNonEmpty(value: string, fieldName: string): void {
  if (!value || value.trim() === "") {
    throw new Error(`${fieldName} não pode ser vazio!`);
  }
}

export function ensurePositive(value: number, fieldName: string): void {
  if (value < 0) {
    throw new Error(`${fieldName} deve ser maior ou igual a 0!`);
  }
}

export function ensureBiggerThanZero(value: number, fieldName: string): void {
  if (value <= 0) {
    throw new Error(`${fieldName} deve ser maior que 0!`);
  }
}

export function ensureEditable(value: boolean, fieldName: string): void {
  if (!value) {
    throw new Error(`${fieldName} não pode ser editado!`);
  }
}
