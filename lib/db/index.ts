import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as { pgPool?: Pool; db?: any }

let db: any

if (process.env.DATABASE_URL) {
  try {
    const isNeon =
      process.env.DATABASE_URL.includes('neon.tech') ||
      process.env.DATABASE_URL.includes('sslmode=require')
    const pool =
      globalForDb.pgPool ??
      new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isNeon ? { rejectUnauthorized: false } : undefined,
      })
    if (process.env.NODE_ENV !== 'production') globalForDb.pgPool = pool
    db = drizzle(pool, { schema })
  } catch (err) {
    console.warn('[AI Studio] Database connection error — using fallback mock:', err)
  }
}

if (!db) {
  console.warn('[AI Studio] DATABASE_URL not set — using in-memory mock proxy')
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  }
  db = new Proxy(
    {},
    {
      get: (_, prop) =>
        prop === 'query'
          ? new Proxy({}, { get: () => noOp })
          : () => ({
              from: () => ({
                orderBy: () => ({
                  orderBy: async () => [],
                  then: (resolve: any) => resolve([]),
                }),
                where: () => ({
                  limit: async () => [],
                  returning: async () => [],
                }),
                limit: async () => [],
                then: (resolve: any) => resolve([]),
              }),
              values: () => ({
                onConflictDoNothing: async () => ({}),
                returning: async () => [],
              }),
              set: () => ({
                where: () => ({
                  returning: async () => [],
                }),
              }),
              where: () => ({
                returning: async () => [],
              }),
              transaction: async (cb: any) => cb(db),
            }),
    },
  )
}

export { db }
