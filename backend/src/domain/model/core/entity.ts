import { ensureEditable, ensurePropExists, ensurePropValueType } from "./utils";

export abstract class Entity<T extends Record<string, unknown>> {
  protected readonly _props: T;
  protected readonly editability: Record<keyof T, boolean>;

  protected constructor(props: T, editability: Record<keyof T, boolean>) {
    this._props = props;
    this.editability = editability;
  }

  get props(): Readonly<T> {
    return this._props;
  }

  private assign<K extends keyof T>(key: K, value: T[K]): void {
    this._props[key] = value;
  }

  protected set_prop(key_any: unknown, value_any: unknown): void {
    ensurePropExists(this._props, key_any as string);
    const key = key_any as keyof T;
    ensurePropValueType(value_any, key as string, typeof this._props[key]);
    const value = value_any as T[typeof key];
    ensureEditable(this.editability[key], key as string);
    this.assign(key, value);
  }
}
