import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'

export function CatalogNav() {
  return (
    <nav
      aria-label="Volver al catálogo"
      className="glass-green flex flex-col items-center justify-between gap-4 rounded-[2rem] p-6 sm:flex-row sm:p-8"
    >
      <div className="text-center sm:text-left">
        <p className="font-serif text-2xl font-semibold text-white">¿Sigues explorando?</p>
        <p className="text-emerald-100/70">Rosas del desierto, cactos, suculentas y orquídeas te esperan.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/#plantas"
          className="group inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-400/35 px-6 py-3 font-medium text-white backdrop-blur-xl transition-all duration-200 hover:bg-emerald-400/55 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
          Volver al catálogo
        </Link>
        <a
          href="#contacto"
          className="glass-white inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-white/25 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Hablar con el vivero
        </a>
      </div>
    </nav>
  )
}
