import Image from 'next/image'
import { ArrowRight, Leaf } from 'lucide-react'

const collections = ['Rosas del desierto', 'Cactos de colección', 'Suculentas', 'Orquídeas']

export function Hero() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden">
      <Image
        src="/images/hero.png"
        alt="Interior de un invernadero con orquídeas, cactos y suculentas bajo luz suave"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-950/80 via-emerald-950/55 to-emerald-950/90"
      />

      <div className="mx-auto flex min-h-svh max-w-5xl flex-col justify-center px-6 pt-32 pb-24">
        <p className="glass-white mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm text-emerald-50">
          <Leaf className="size-4 text-emerald-300" aria-hidden="true" />
          Vivero boutique · Plantas de colección
        </p>

        <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-tight text-balance text-white sm:text-7xl lg:text-8xl">
          Donde el desierto <span className="text-emerald-300 italic">florece</span> con paciencia
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-emerald-50/85">
          En Hortiadem Abunto cultivamos rosas del desierto, cactos raros, suculentas y orquídeas
          elegidas a mano, para quienes aman las plantas con carácter.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#plantas"
            className="glass-green-strong group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-emerald-800/80 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
          >
            Explorar la colección
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
          <a
            href="#contacto"
            className="glass-white inline-flex items-center rounded-full px-7 py-3.5 text-base text-white transition-colors hover:bg-white/25 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
          >
            Visitar el vivero
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 px-4" id="colecciones">
        <ul className="glass-green mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-3xl px-6 py-4 text-sm text-emerald-50 sm:rounded-full">
          {collections.map((name) => (
            <li key={name} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
