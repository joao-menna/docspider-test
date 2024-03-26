import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

interface ReturnType {
  db: NodePgDatabase<Record<string, never>>
  client: Client
}

export default async function getDB (): Promise<ReturnType> {
  const client = new Client({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT ?? '5432')
  })

  await client.connect()

  const db = drizzle(client)
  return {
    db,
    client
  }
}