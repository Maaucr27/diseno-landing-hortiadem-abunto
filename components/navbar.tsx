'use client'

import { useState } from 'react'
import { Menu, Sprout, X } from 'lucide-react'

const links = [
  { href: '#colecciones', label: 'Colecciones' },
  { href: '#plantas', label: 'Plantas' },
  { href: '#contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Principal"
        className="glass-green-strong mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 pr-2 pl-5 text-emerald-50"
      >
        <a
          href="#inicio"
          className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
        >
          <Sprout className="size-5 text-emerald-300" aria-hidden="true" />
          <span className="font-serif text-xl leading-none font-semibold tracking-tight">
            Hortiadem <span className="text-emerald-300 italic">Abunto</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-emerald-50/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#plantas"
              className="ml-1 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              Ver catálogo
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-emerald-200 md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="menu-movil"
          className="glass-green-strong mx-auto mt-2 max-w-5xl rounded-3xl p-3 text-emerald-50 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base transition-colors hover:bg-white/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
