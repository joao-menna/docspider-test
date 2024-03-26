import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const documentTable = pgTable('document', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  description: text('description').notNull(),
  fileName: text('file_name').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow()
})