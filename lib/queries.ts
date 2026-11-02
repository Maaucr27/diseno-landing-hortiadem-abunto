import { cache } from 'react'
import { asc, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { favorites, plants } from '@/lib/db/schema'
import type { LightLevel, Product, WaterLevel } from '@/lib/products'
import {
  getInMemoryAdminPlants,
  getInMemoryFavorites,
  getInMemoryProducts,
} from '@/lib/db/memory-store'

export const getProducts = cache(async (): Promise<Product[]> => {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(plants).orderBy(asc(plants.sortOrder))
      if (rows && rows.length > 0) {
        return rows.map((row: any) => ({
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
      }
    } catch (err) {
      console.warn('[AI Studio] Database getProducts error, falling back to memory store:', err)
    }
  }
  return getInMemoryProducts()
})

export async function getAdminPlants() {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(plants).orderBy(asc(plants.sortOrder), asc(plants.name))
      if (rows && rows.length > 0) return rows
    } catch (err) {
      console.warn('[AI Studio] Database getAdminPlants error, falling back to memory store:', err)
    }
  }
  return getInMemoryAdminPlants()
}

export async function getFavoritePlantIds(): Promise<string[]> {
  try {
    const { userId } = await auth()
    if (!userId) return []

    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select({ plantId: favorites.plantId })
          .from(favorites)
          .where(eq(favorites.userId, userId))
        return rows.map((row: any) => row.plantId)
      } catch (err) {
        console.warn('[AI Studio] Database getFavoritePlantIds error:', err)
      }
    }
    return getInMemoryFavorites(userId)
  } catch (err) {
    console.warn('[AI Studio] Clerk auth error in getFavoritePlantIds:', err)
    return []
  }
}
