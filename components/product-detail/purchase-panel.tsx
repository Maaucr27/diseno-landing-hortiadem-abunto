'use client'

import { useId, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import type { PlantSize } from '@/lib/plant-details'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function PurchasePanel({ sizes }: { sizes: PlantSize[] }) {
  const groupName = useId()
  const [sizeId, setSizeId] = useState(sizes[0].id)
  const [reserved, setReserved] = useState(false)
  const selected = sizes.find((size) => size.id === sizeId) ?? sizes[0]

  function selectSize(id: string) {
    setSizeId(id)
    setReserved(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-emerald-100/70">Precio</p>
        <p className="font-serif text-6xl leading-none font-semibold text-white tabular-nums">
          {priceFormatter.format(selected.price)}
          <span className="ml-2 font-sans text-base font-normal text-emerald-100/70">USD</span>
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-emerald-50">
          Presentación
        </legend>
        <div className="flex flex-col gap-3">
          {sizes.map((size) => (
            <label
              key={size.id}
              className="glass-green group relative flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:bg-emerald-900/70 has-checked:border-emerald-300/80 has-checked:bg-emerald-800/70 has-checked:ring-1 has-checked:ring-emerald-300/60 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-emerald-300"
            >
              <input
                type="radio"
                name={groupName}
                value={size.id}
                checked={size.id === sizeId}
                onChange={() => selectSize(size.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex size-5 shrink-0 items-center justify-center rounded-full border border-emerald-200/60 transition-colors group-has-checked:border-emerald-300 group-has-checked:bg-emerald-300"
              >
                <Check className="size-3 text-emerald-950 opacity-0 transition-opacity group-has-checked:opacity-100" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium text-white">{size.label}</span>
                <span className="text-sm text-pretty text-emerald-100/70">{size.description}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end">
                <span className="font-medium text-white tabular-nums">
                  {priceFormatter.format(size.price)}
                </span>
                <span className="text-xs text-emerald-300">{size.stock}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <button
          type="button"
          onClick={() => setReserved((value) => !value)}
          aria-pressed={reserved}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-emerald-200/50 bg-emerald-400/35 px-8 py-5 text-lg font-semibold text-white shadow-[0_0_44px_-6px_rgba(52,211,153,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400/55 hover:shadow-[0_0_64px_-4px_rgba(52,211,153,0.9),inset_0_1px_0_rgba(255,255,255,0.45)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100"
          />
          {reserved ? (
            <Check className="size-5" aria-hidden="true" />
          ) : (
            <ShoppingBag className="size-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" />
          )}
          {reserved ? 'Reserva solicitada' : `Reservar ${selected.label}`}
        </button>
        <p className="mt-3 text-center text-sm text-emerald-100/70" aria-live="polite">
          {reserved
            ? 'Te escribiremos para confirmar el anticipo y la entrega.'
            : 'Sin pago inmediato. Reserva y coordinamos contigo.'}
        </p>
      </div>
    </div>
  )
}
