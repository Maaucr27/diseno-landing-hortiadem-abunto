import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ArrowLeft, Leaf } from 'lucide-react'

export function AdminHeader({ name }: { name: string }) {
  return (
    <header className="sticky top-3 z-40 mx-auto w-full max-w-6xl px-3 sm:px-6">
      <div className="glass-green-strong flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5">
        <div className="flex min-w-0 items-center gap-2.5 text-emerald-50">
          <Leaf className="size-5 shrink-0 text-emerald-200" aria-hidden="true" />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-serif text-lg font-medium">Abunto</p>
            <p className="hidden truncate text-xs text-emerald-100/70 sm:block">
              Panel de administración
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-medium text-emerald-50 transition-all duration-200 hover:bg-white/20 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Volver al sitio</span>
            <span className="sm:hidden">Sitio</span>
          </Link>
          <span className="hidden text-sm text-emerald-100/80 md:block">{name}</span>
          <UserButton appearance={{ elements: { avatarBox: 'size-9' } }} />
        </div>
      </div>
    </header>
  )
}
