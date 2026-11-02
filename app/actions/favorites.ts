'use server'

import { and, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { favorites, plants } from '@/lib/db/schema'

type ToggleResult = { ok: true; favorited: boolean } | { ok: false; error: 'unauthorized' | 'not-found' }

export async function toggleFavorite(plantId: string): Promise<ToggleResult> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: 'unauthorized' }

  const [plant] = await db
    .select({ id: plants.id })
    .from(plants)
    .where(eq(plants.id, plantId))
    .limit(1)
  if (!plant) return { ok: false, error: 'not-found' }

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
