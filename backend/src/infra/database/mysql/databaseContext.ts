import mysql from "mysql2/promise";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import { injectable } from "tsyringe";
import { requireEnv } from "../../../shared/requireEnv";

@injectable()
export class DatabaseContext {
  public db;

  public constructor() {
    const { host, port, user, password, database } = requireEnv();
    const pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
    });
    this.db = drizzle(pool, { schema, mode: "default" });
  }
}
