import { getFavoritePlantIds, getProducts } from '@/lib/queries'
import { ProductCard } from '@/components/product-card'

export async function ProductGrid() {
  const [products, favoriteIds] = await Promise.all([getProducts(), getFavoritePlantIds()])
  const favorites = new Set(favoriteIds)

  return (
    <section id="plantas" className="relative isolate overflow-hidden bg-emerald-50 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 -z-10 size-96 rounded-full bg-emerald-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 -z-10 size-[28rem] rounded-full bg-lime-200/50 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-emerald-700 uppercase">
            Selección de temporada
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight font-medium tracking-tight text-balance text-emerald-950 sm:text-6xl">
            Plantas con <span className="text-emerald-700 italic">historia</span>
          </h2>
          <p className="mt-4 text-lg text-pretty text-emerald-950/70">
            Cada ejemplar se cultiva en el vivero y se entrega con su guía de luz y riego.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id} className="flex">
              <ProductCard product={product} isFavorite={favorites.has(product.id)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
