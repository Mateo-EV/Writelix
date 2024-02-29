import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

import { env } from "@/env.js";
import * as schema from "./schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });

//LOGGER CONFIGURATION

import { type Logger } from "drizzle-orm/logger";

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

export const db = drizzle(pool, {
  schema,
  logger: env.NODE_ENV === "production" ? false : new CustomLogger(),
});
