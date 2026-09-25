import { v7 } from "uuid";
import { injectable } from "tsyringe";
import type { IIdGenerator } from "../../domain";

@injectable()
export class IdGenerator implements IIdGenerator {
  public generate(): string {
    return v7();
  }
}
