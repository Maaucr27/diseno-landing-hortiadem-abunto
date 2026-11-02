'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { GalleryImage } from '@/lib/plant-details'

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [activeId, setActiveId] = useState(images[0].id)
  const active = images.find((image) => image.id === activeId) ?? images[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-green relative aspect-square overflow-hidden rounded-[2rem] p-2">
        <div className="relative size-full overflow-hidden rounded-[1.5rem]">
          <Image
            key={active.id}
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="animate-in fade-in object-cover duration-500"
          />
        </div>
        <p className="glass-green-strong absolute bottom-6 left-6 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-emerald-50">
          {active.label}
        </p>
      </div>

      <ul className="grid grid-cols-4 gap-3" aria-label="Miniaturas de la galería">
        {images.map((image) => {
          const selected = image.id === active.id
          return (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveId(image.id)}
                aria-pressed={selected}
                aria-label={`Ver ${image.label.toLowerCase()}`}
                className={`glass-green relative block aspect-square w-full overflow-hidden rounded-2xl p-1 transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                  selected
                    ? 'border-emerald-300! opacity-100 ring-2 ring-emerald-300/70'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="relative block size-full overflow-hidden rounded-xl">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 12vw, 25vw"
                    className="object-cover"
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
