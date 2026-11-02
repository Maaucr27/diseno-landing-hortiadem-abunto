import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Gallery } from '@/components/product-detail/gallery'
import { PurchasePanel } from '@/components/product-detail/purchase-panel'
import { CareGrid } from '@/components/product-detail/care-grid'
import { DetailsAccordion } from '@/components/product-detail/details-accordion'
import { CatalogNav } from '@/components/product-detail/catalog-nav'
import { getPlantDetail, plantDetails } from '@/lib/plant-details'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const plant = await getPlantDetail(slug)
  if (!plant) return {}
  return {
    title: `${plant.name} | Hortiadem Abunto`,
    description: plant.summary,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const plant = await getPlantDetail(slug)
  if (!plant) notFound()

  return (
    <>
      <Navbar />
      <main className="relative isolate overflow-hidden bg-emerald-950 px-4 pt-32 pb-20 text-emerald-50">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 -z-10 size-[40rem] rounded-full bg-emerald-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 -left-48 -z-10 size-[34rem] rounded-full bg-emerald-500/15 blur-3xl"
        />

        <div className="mx-auto max-w-6xl">
          <nav aria-label="Ruta de navegación" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-emerald-100/70">
              <li>
                <Link href="/" className="hover:text-white hover:underline">
                  Inicio
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li>
                <Link href="/#plantas" className="hover:text-white hover:underline">
                  Catálogo
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li aria-current="page" className="text-white">
                {plant.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Gallery images={plant.gallery} />
            </div>

            <div className="flex flex-col gap-8">
              <header className="flex flex-col gap-4">
                <p className="glass-white inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-50">
                  <Sparkles className="size-4 text-amber-200" aria-hidden="true" />
                  {plant.badge}
                </p>
                <h1 className="font-serif text-5xl leading-[1.02] font-semibold tracking-tight text-balance text-white sm:text-6xl">
                  {plant.name}
                </h1>
                <p className="font-serif text-2xl text-emerald-300 italic">{plant.scientificName}</p>
                <p className="max-w-xl text-lg leading-relaxed text-pretty text-emerald-50/80">
                  {plant.summary}
                </p>
              </header>

              <div className="glass-green rounded-[2rem] p-6 sm:p-8">
                <PurchasePanel sizes={plant.sizes} />
              </div>
            </div>
          </div>

          <section aria-labelledby="ficha-tecnica" className="mt-20">
            <h2
              id="ficha-tecnica"
              className="mb-2 font-serif text-4xl font-semibold tracking-tight text-white"
            >
              Ficha técnica de cuidados
            </h2>
            <p className="mb-8 text-emerald-100/70">Toca cada tarjeta para ver el consejo del vivero.</p>
            <CareGrid items={plant.care} />
          </section>

          <section aria-labelledby="mas-informacion" className="mt-20">
            <h2
              id="mas-informacion"
              className="mb-8 font-serif text-4xl font-semibold tracking-tight text-white"
            >
              Todo sobre tu planta
            </h2>
            <DetailsAccordion sections={plant.sections} />
          </section>

          <div className="mt-20">
            <CatalogNav />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
