export class Entity<props> {
  protected readonly _props: props;

  constructor(props: props) {
    this._props = props;
  }

  get props(): Readonly<props> {
    return this._props;
  }

  protected assign<K extends keyof props>(key: K, value: props[K]): void {
    this._props[key] = value;
  }
}
