import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { ProductGrid } from '@/components/product-grid'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </>
  )
}
