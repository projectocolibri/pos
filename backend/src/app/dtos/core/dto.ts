export abstract class DTO<T extends Record<string, unknown>> {
  protected readonly _props: T;

  protected constructor(props: T) {
    this._props = props;
  }

  get props(): Readonly<T> {
    return this._props;
  }

  toJSON(): T {
    return this._props;
  }
}
