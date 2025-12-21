"use client"

import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { searchProducts } from "@/lib/data"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const results = query ? searchProducts(query) : []

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            {query ? `Search results for "${query}"` : "Search Products"}
          </h1>
          <p className="text-muted-foreground">
            {results.length} {results.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products found matching your search.</p>
            <p className="text-sm text-muted-foreground">Try searching for something else.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Enter a search term to find products.</p>
          </div>
        )}
      </div>
    </section>
  )
}
