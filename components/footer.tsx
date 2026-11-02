import { Clock, Mail, MapPin, Phone, Sprout } from 'lucide-react'

const contacts = [
  { icon: MapPin, label: 'Camino de los Cactos 120, Valle Verde' },
  { icon: Phone, label: '+00 000 000 000', href: 'tel:+00000000000' },
  { icon: Mail, label: 'hola@hortiademabunto.com', href: 'mailto:hola@hortiademabunto.com' },
  { icon: Clock, label: 'Mar a Dom · 9:00 – 18:00' },
]

export function Footer() {
  return (
    <footer id="contacto" className="relative isolate overflow-hidden bg-emerald-950 px-4 py-20 text-emerald-50">
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-emerald-600/30 blur-3xl"
      />

      <div className="glass-green mx-auto grid max-w-5xl gap-10 rounded-[2rem] p-8 sm:p-12 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="size-6 text-emerald-300" aria-hidden="true" />
            <span className="font-serif text-3xl font-semibold tracking-tight">
              Hortiadem <span className="text-emerald-300 italic">Abunto</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-pretty text-emerald-50/75">
            Vivero boutique de rosas del desierto, cactos de colección, suculentas y orquídeas.
            Visítanos y elige tu próxima planta en persona.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium tracking-widest text-emerald-300 uppercase">
            Contacto
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {contacts.map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-emerald-300" aria-hidden="true" />
                {href ? (
                  <a href={href} className="transition-colors hover:text-white hover:underline">
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-emerald-50/60">
        © {new Date().getFullYear()} Hortiadem Abunto. Cultivado con paciencia.
      </p>
    </footer>
  )
}
