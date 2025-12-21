import { ProductCard } from "@/components/product-card"
// import { getFeaturedProducts } from "@/lib/data"
import { getFeaturedProductsAction } from "@/app/actions/product"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export async function FeaturedProducts() {
  const { products: featuredProducts } = await getFeaturedProductsAction()

  if (!featuredProducts) return null

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Bestsellers</h2>
            <p className="text-primary-foreground/80 max-w-xl">Our most loved products, chosen by customers like you</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex gap-2">
            <Link href="/category/clothes">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild className="gap-2">
            <Link href="/category/clothes">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
