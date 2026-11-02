'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Droplets, MessageCircle, Plus, Sun } from 'lucide-react'
import { FavoriteButton } from '@/components/favorite-button'
import type { Product } from '@/lib/products'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function ProductCard({
  product,
  isFavorite,
}: {
  product: Product
  isFavorite: boolean
}) {
  const [added, setAdded] = useState(false)

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-3xl border border-emerald-900/10 bg-white/70 shadow-sm shadow-emerald-950/5 backdrop-blur-md transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-950/10">
      <div className="relative aspect-square overflow-hidden">
        <Link
          href={`/producto/${product.id}`}
          className="relative block size-full cursor-pointer"
          title={`Ver ficha técnica de ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>
        <ul className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5" aria-label="Cuidados">
          <li className="glass-green-strong flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs text-emerald-50">
            <Droplets className="size-3.5 text-sky-200" aria-hidden="true" />
            {product.water}
          </li>
          <li className="glass-green-strong flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs text-emerald-50">
            <Sun className="size-3.5 text-amber-200" aria-hidden="true" />
            {product.light}
          </li>
        </ul>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            plantId={product.id}
            plantName={product.name}
            initialFavorited={isFavorite}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium tracking-wider text-emerald-700 uppercase">
            {product.category}
          </p>
          <h3 className="mt-1 font-serif text-2xl leading-tight font-semibold text-emerald-950">
            <Link
              href={`/producto/${product.id}`}
              className="transition-colors hover:text-emerald-700"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-emerald-800/70 italic">{product.scientificName}</p>
          <p className="mt-3 text-sm leading-relaxed text-pretty text-emerald-950/70">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className={`font-serif font-semibold whitespace-nowrap text-emerald-950 ${
              product.price === null ? 'text-lg' : 'text-2xl'
            }`}
          >
            {product.price === null ? 'A pedido' : priceFormatter.format(product.price)}
          </span>

          {product.action === 'add' ? (
            <button
              type="button"
              onClick={() => setAdded((value) => !value)}
              aria-pressed={added}
              className="glass-green-strong inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-800/85 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              {added ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
              {added ? 'Agregado' : 'Agregar'}
            </button>
          ) : (
            <a
              href="#contacto"
              className="glass-green-strong inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-800/85 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Consultar
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
