import { Pool } from "@neondatabase/serverless";

/**
 * PostgreSQL Database Adapter for Vercel Postgres / Neon.
 * 
 * Supports dual-mode:
 * 1. If POSTGRES_URL or DATABASE_URL is configured (Vercel Postgres connected):
 *    Executes queries via high-speed serverless connection.
 * 2. If not configured yet (before user creates database in Vercel):
 *    Gracefully reports false without crashing the application.
 */

let globalPool: Pool | null = null;

export function isPostgresConfigured(): boolean {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  return Boolean(url && url.trim().length > 0);
}

export function getDatabaseConnectionString(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    null
  );
}

export function getDatabaseInfo() {
  const isConfigured = isPostgresConfigured();
  return {
    provider: isConfigured ? "Vercel Postgres (Neon)" : "Atomic Persistent Storage (JSON)",
    isConfigured,
    mode: isConfigured ? "PostgreSQL Relational DB" : "Encrypted Local File Storage",
  };
}

function getPool(): Pool {
  if (!globalPool) {
    const connectionString = getDatabaseConnectionString();
    if (!connectionString) {
      throw new Error("قاعدة بيانات PostgreSQL غير مهيأة في متغيرات البيئة (POSTGRES_URL).");
    }
    globalPool = new Pool({ connectionString });
  }
  return globalPool;
}

/**
 * Executes a parameterized SQL query safely against PostgreSQL.
 * Parameterized queries guarantee 100% protection against SQL Injection.
 */
export async function executeQuery<T = Record<string, unknown>>(
  sqlQuery: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  const res = await pool.query(sqlQuery, params);
  return res.rows as T[];
}

/**
 * Ensures required database tables exist if running on a fresh PostgreSQL database.
 */
export async function ensurePostgresTables(): Promise<boolean> {
  if (!isPostgresConfigured()) return false;

  try {
    const ddl = `
      CREATE TABLE IF NOT EXISTS contact_requests (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64),
          user_email VARCHAR(255),
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(64) NOT NULL,
          email VARCHAR(255),
          product VARCHAR(255),
          message TEXT NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'NEW',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_contact_requests_user_email ON contact_requests(user_email);
      CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
    `;
    await executeQuery(ddl);
    return true;
  } catch (err) {
    console.error("[Database] Auto-migration warning:", err);
    return false;
  }
}
