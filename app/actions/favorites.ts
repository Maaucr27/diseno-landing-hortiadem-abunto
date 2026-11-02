'use server'

import { and, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { favorites, plants } from '@/lib/db/schema'
import { toggleInMemoryFavorite } from '@/lib/db/memory-store'

type ToggleResult = { ok: true; favorited: boolean } | { ok: false; error: 'unauthorized' | 'not-found' }

export async function toggleFavorite(plantId: string): Promise<ToggleResult> {
  let userId: string | null = null
  try {
    const authObj = await auth()
    userId = authObj?.userId ?? null
  } catch {
    userId = null
  }

  if (!userId) return { ok: false, error: 'unauthorized' }

  if (process.env.DATABASE_URL) {
    try {
      const [plant] = await db
        .select({ id: plants.id })
        .from(plants)
        .where(eq(plants.id, plantId))
        .limit(1)

      if (plant) {
        const removed = await db
          .delete(favorites)
          .where(and(eq(favorites.userId, userId), eq(favorites.plantId, plantId)))
          .returning({ plantId: favorites.plantId })

        if (removed.length > 0) {
          revalidatePath('/')
          return { ok: true, favorited: false }
        }

        await db.insert(favorites).values({ userId, plantId }).onConflictDoNothing()
        revalidatePath('/')
        return { ok: true, favorited: true }
      }
    } catch (err) {
      console.warn('[AI Studio] Database error in toggleFavorite, using memory store:', err)
    }
  }

  const isFavorited = toggleInMemoryFavorite(userId, plantId)
  revalidatePath('/')
  return { ok: true, favorited: isFavorited }
}
