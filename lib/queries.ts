import { cache } from 'react'
import { asc, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { favorites, plants } from '@/lib/db/schema'
import type { LightLevel, Product, WaterLevel } from '@/lib/products'

export const getProducts = cache(async (): Promise<Product[]> => {
  const rows = await db.select().from(plants).orderBy(asc(plants.sortOrder))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    scientificName: row.scientificName,
    category: row.category,
    description: row.description,
    image: row.image,
    imageAlt: row.imageAlt,
    water: row.water as WaterLevel,
    light: row.light as LightLevel,
    price: row.price,
    action: row.action === 'inquire' ? 'inquire' : 'add',
  }))
})

export async function getAdminPlants() {
  return db.select().from(plants).orderBy(asc(plants.sortOrder), asc(plants.name))
}

export async function getFavoritePlantIds(): Promise<string[]> {
  const { userId } = await auth()
  if (!userId) return []

  const rows = await db
    .select({ plantId: favorites.plantId })
    .from(favorites)
    .where(eq(favorites.userId, userId))

  return rows.map((row) => row.plantId)
}
