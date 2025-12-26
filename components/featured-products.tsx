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
    <section className="py-20 md:py-28 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12 border-b border-border/40 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-normal mb-2 tracking-tight">New Arrivals</h2>
            <p className="text-sm text-muted-foreground font-light">We picked the best for you</p>
          </div>
          <div className="flex gap-4">
            <span className="text-sm font-medium border-b border-black pb-1 cursor-pointer">New Arrivals</span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-black transition-colors">Best Sellers</span>
          </div>
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
