import { PrismaClient } from "@/generated/prisma/client";

/** Production + Railway: PostgreSQL only. No SQLite in this file (avoids Turbopack bundling native deps). */
export function createPrismaClient(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL;

  if (!url || (!url.startsWith("postgresql://") && !url.startsWith("postgres://"))) {
    throw new Error(
      "DATABASE_URL must be a PostgreSQL connection string (postgresql://...)."
    );
  }

  const { PrismaPg } = require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
  const { Pool } = require("pg") as typeof import("pg");
  const pool = new Pool({ connectionString: url });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}