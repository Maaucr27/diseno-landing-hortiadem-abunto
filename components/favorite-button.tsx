'use client'

import { useOptimistic, useTransition } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/app/actions/favorites'

export function FavoriteButton({
  plantId,
  plantName,
  initialFavorited,
}: {
  plantId: string
  plantName: string
  initialFavorited: boolean
}) {
  const { isSignedIn, isLoaded } = useUser()
  const { openSignIn } = useClerk()
  const [, startTransition] = useTransition()
  const [favorited, setFavorited] = useOptimistic(initialFavorited, (_, next: boolean) => next)

  function handleClick() {
    if (!isLoaded) return
    if (!isSignedIn) {
      openSignIn()
      return
    }
    startTransition(async () => {
      setFavorited(!favorited)
      await toggleFavorite(plantId)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorited}
      aria-label={
        favorited ? `Quitar ${plantName} de favoritos` : `Agregar ${plantName} a favoritos`
      }
      className="glass-green-strong flex size-10 items-center justify-center rounded-full text-emerald-50 transition-all duration-200 hover:bg-emerald-800/85 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
    >
      <Heart
        className={`size-5 transition-colors ${
          favorited ? 'fill-rose-400 text-rose-400' : 'text-emerald-50'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}
