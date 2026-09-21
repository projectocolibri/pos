import { loadDotenv } from "../utils";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import { injectable } from "tsyringe";

@injectable()
export class DatabaseContext {
  public db;

  public constructor() {
    loadDotenv();
    const pool = mysql.createPool({
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!),
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 10,
    });
    this.db = drizzle(pool, { schema, mode: "default" });
  }
}
