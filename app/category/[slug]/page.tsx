import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { getProductsByCategory, categories } from "@/lib/data"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)

  if (!category) {
    return { title: "Category Not Found" }
  }

  return {
    title: `${category.name} | LUXE`,
    description: `Shop our curated collection of ${category.name.toLowerCase()}. Premium quality products with timeless design.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)

  if (!category) {
    notFound()
  }

  const products = getProductsByCategory(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-muted-foreground mb-4">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">{products.length} products</p>
          </div>
        </section>

        {/* Products */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 flex-shrink-0">
                <ProductFilters />
              </aside>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
