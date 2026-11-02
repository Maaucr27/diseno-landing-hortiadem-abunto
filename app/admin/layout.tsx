import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Administración | Hortiadem Abunto',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-emerald-950 bg-[radial-gradient(60rem_40rem_at_15%_-10%,rgb(16_120_87/0.45),transparent),radial-gradient(50rem_36rem_at_100%_30%,rgb(6_78_59/0.55),transparent)] pt-3 pb-16 text-emerald-50">
      {children}
      <Toaster theme="dark" position="bottom-right" />
    </div>
  )
}
