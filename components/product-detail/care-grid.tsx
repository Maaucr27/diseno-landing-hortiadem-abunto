'use client'

import { useState } from 'react'
import { Droplets, Leaf, Shovel, Sun, type LucideIcon } from 'lucide-react'
import type { CareItem, CareKey } from '@/lib/plant-details'

const icons: Record<CareKey, LucideIcon> = {
  light: Sun,
  water: Droplets,
  substrate: Shovel,
  difficulty: Leaf,
}

const iconTones: Record<CareKey, string> = {
  light: 'text-amber-200',
  water: 'text-sky-200',
  substrate: 'text-orange-200',
  difficulty: 'text-emerald-300',
}

export function CareGrid({ items }: { items: CareItem[] }) {
  const [openKey, setOpenKey] = useState<CareKey | null>(null)

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = icons[item.key]
        const open = openKey === item.key
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => setOpenKey(open ? null : item.key)}
              aria-expanded={open}
              className="glass-green group flex h-full w-full flex-col items-start gap-3 rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-900/70 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 aria-expanded:bg-emerald-800/70 aria-expanded:ring-1 aria-expanded:ring-emerald-300/50"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Icon className={`size-6 ${iconTones[item.key]}`} aria-hidden="true" />
              </span>
              <span className="text-xs font-medium tracking-widest text-emerald-300 uppercase">
                {item.title}
              </span>
              <span className="font-serif text-xl leading-snug font-semibold text-balance text-white">
                {item.value}
              </span>
              <span
                className={`grid transition-all duration-300 ease-out ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <span className="overflow-hidden text-sm leading-relaxed text-pretty text-emerald-100/80">
                  {item.detail}
                </span>
              </span>
              <span className="mt-auto pt-1 text-xs text-emerald-200/60">
                {open ? 'Ocultar consejo' : 'Ver consejo'}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
