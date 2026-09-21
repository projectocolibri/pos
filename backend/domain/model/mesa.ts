import { AggregateRoot } from "../../core";
import { ensureEditable, ensureNonEmpty } from "./utils/validation";

interface MesaProps {
  salaId: string;
  identificador: string;
  estado: string;
  obs: string;
}

const editability = {
  salaId: false,
  identificador: true,
  estado: true,
  obs: true,
};

export class Mesa extends AggregateRoot<MesaProps> {
  private constructor(id: string, props: MesaProps) {
    super(id, props);
  }

  private static create(id: string, props: MesaProps): Mesa {
    ensureNonEmpty(props.salaId, "ID da sala");
    return new Mesa(id, props);
  }

  public static new(id: string, salaId: string): Mesa {
    return this.create(id, {
      salaId,
      identificador: "",
      estado: "",
      obs: "",
    });
  }

  public static fromPersistence(id: string, props: MesaProps): Mesa {
    return this.create(id, props);
  }

  public set(key: keyof MesaProps, value: MesaProps[keyof MesaProps]): void {
    ensureEditable(editability[key], key);
    this.assign(key, value);
  }
}
