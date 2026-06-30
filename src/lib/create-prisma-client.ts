import { PrismaClient } from "@/generated/prisma/client";

export function createPrismaClient(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL ?? "file:./dev.db";
  const isPostgres = url.startsWith("postgresql://") || url.startsWith("postgres://");

  if (isPostgres) {
    const { PrismaPg } = require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
    const { Pool } = require("pg") as typeof import("pg");
    const pool = new Pool({ connectionString: url });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  // Production builds must use PostgreSQL (Railway / Vercel / Neon)
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Production requires DATABASE_URL to be a PostgreSQL connection string."
    );
  }

  // Local dev only — sqlite is a devDependency
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as typeof import("@prisma/adapter-better-sqlite3");
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });
}