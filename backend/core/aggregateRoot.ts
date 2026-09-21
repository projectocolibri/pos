export abstract class AggregateRoot<props> {
  public readonly id: string;
  protected readonly _props: props;

  constructor(id: string, props: props) {
    this.id = id;
    this._props = props;
  }

  get props(): Readonly<props> {
    return this._props;
  }

  protected assign<K extends keyof props>(key: K, value: props[K]): void {
    this._props[key] = value;
  }
}
