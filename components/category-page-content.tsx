"use client"

import { useState, useEffect, useMemo } from "react"
import { ProductFilters } from "@/components/product-filters"
import { ProductCard } from "@/components/product-card"
import { Product, Category } from "@/lib/types"

interface CategoryPageContentProps {
    initialProducts: Product[]
    category: Category
    slug: string
}

export function CategoryPageContent({ initialProducts, category, slug }: CategoryPageContentProps) {
    // 1. Calculate dynamic price range
    const { minPrice, maxPrice } = useMemo(() => {
        if (initialProducts.length === 0) return { minPrice: 0, maxPrice: 1000 }
        const prices = initialProducts.map((p) => p.price)
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
        }
    }, [initialProducts])

    // 2. State for filters
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice])

    // Reset price range when category changes (or initial calculation happens)
    useEffect(() => {
        setPriceRange([minPrice, maxPrice])
    }, [minPrice, maxPrice])

    // 3. Filter products
    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            const price = product.price
            return price >= priceRange[0] && price <= priceRange[1]
        })
    }, [initialProducts, priceRange])

    // Helper for header styling (preserving your custom logic)
    const getHeaderColor = (slug: string) => {
        switch (slug) {
            case "perfumes":
                return "bg-secondary" // Peach
            case "cosmetics":
                return "bg-primary text-primary-foreground" // Red
            case "shoes":
                return "bg-[#8B4513] text-white" // Brown
            case "clothes":
                return "bg-[#F5F5DC] text-black" // Cream
            default:
                return "bg-muted/30"
        }
    }
    const headerColor = getHeaderColor(slug)

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className={`relative pt-3 pb-3 md:pt-5 md:pb-5 ${headerColor}`}>
                <div className="container mx-auto px-4">
                    <nav className={`text-xs mb-1 flex justify-start items-center ${slug === "cosmetics" || slug === "shoes" ? "text-white/80" : "text-muted-foreground"}`}>
                        <span>Home</span>
                        <span className="mx-2">/</span>
                        <span className={slug === "cosmetics" || slug === "shoes" ? "text-white" : "text-foreground"}>{category.name}</span>
                    </nav>
                    <div className="text-center">
                        <h1 className="text-2xl md:text-4xl font-serif font-bold mb-0.5">{category.name}</h1>
                    </div>
                    <p className={`text-xs text-left ${slug === "cosmetics" || slug === "shoes" ? "text-white/80" : "text-muted-foreground"}`}>{filteredProducts.length} products</p>
                </div>
            </section>

            {/* Content */}
            <section className={`py-8 md:py-12 ${slug === "perfumes" ? "bg-transparent" : ""}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 flex-shrink-0">
                            <ProductFilters
                                min={minPrice}
                                max={maxPrice}
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                            />
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
