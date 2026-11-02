import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

export const plants = pgTable('plants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  scientificName: text('scientific_name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  imageAlt: text('image_alt').notNull(),
  water: text('water').notNull(),
  light: text('light').notNull(),
  price: integer('price'),
  action: text('action').notNull().default('add'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const favorites = pgTable(
  'favorites',
  {
    userId: text('user_id').notNull(),
    plantId: text('plant_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.plantId] })],
)
