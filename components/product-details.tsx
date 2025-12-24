"use client"

import { Product } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductActions } from "@/components/product-actions"
import { Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
// ... imports

interface ProductDetailsProps {
    productId: string // Added ID to fetch if product is missing
    product?: Product | null
    relatedProducts?: Product[]
    discount?: number
}

export function ProductDetails({ productId, product: initialProduct, relatedProducts: initialRelated, discount: initialDiscount }: ProductDetailsProps) {
    const { t } = useLanguage()

    // State to hold potentially fetched product
    const [product, setProduct] = useState<Product | null | undefined>(initialProduct)
    const [related, setRelated] = useState<Product[]>(initialRelated || [])
    const [isLoading, setIsLoading] = useState(!initialProduct)

    useEffect(() => {
        // If we already have the product from server, just ensure we have related products
        // Actually, we should preferably refresh from DB to get latest stock/price even if server sent it
        // But for now, if missing (Client-only product), we MUST fetch.

        if (!product) {
            const found = db.getProduct(productId)
            setProduct(found)

            if (found) {
                const all = db.getAllProducts()
                const rel = all.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4)
                setRelated(rel)
            }
            setIsLoading(false)
        }
    }, [productId, product])

    // Update discount if we fetched a new product
    const discount = product?.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : (initialDiscount || 0)

    if (isLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Loading product parameters...</div>
    }

    if (!product) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Product Not Found</h2>
                <p className="text-muted-foreground">The product you are looking for does not exist.</p>
                <Link href="/" className="text-primary hover:underline">Return Home</Link>
            </div>
        )
    }

    return (
        <>
            <div className="container mx-auto px-4 py-4">
                <nav className="text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        {t.product.home}
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/category/${product.category}`} className="hover:text-foreground transition-colors capitalize">
                        {product.category}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{product.name}</span>
                </nav>
            </div>

            {/* Product Details */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    <ProductImageGallery
                        images={product.images && product.images.length > 0 ? product.images : [product.image]}
                        name={product.name}
                        discount={discount}
                    />

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category */}
                        <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.category}</p>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-serif font-bold">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {product.rating} ({product.reviews} {t.product.reviews})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="capitalize">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                        {/* Actions */}
                        <ProductActions product={product} />

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{t.product.shippingInfo}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{t.product.returns}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{t.product.warranty}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Tabs */}
            <section className="container mx-auto px-4 py-12">
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                        <TabsTrigger
                            value="description"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
                        >
                            {t.product.description}
                        </TabsTrigger>
                        <TabsTrigger
                            value="details"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
                        >
                            {t.product.details}
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
                        >
                            {t.product.reviews} ({product.reviews})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="py-6">
                        <div className="prose max-w-none">
                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Crafted with meticulous attention to detail, this product represents the perfect balance of quality,
                                style, and functionality. Each piece is carefully inspected to ensure it meets our high standards
                                before reaching your hands.
                            </p>
                        </div>
                    </TabsContent>
                    <TabsContent value="details" className="py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold">{t.product.productInfo}</h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">{t.product.category}</dt>
                                        <dd className="capitalize">{product.category}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">{t.product.availability}</dt>
                                        <dd>{product.inStock ? t.product.inStock : t.product.outOfStock}</dd>
                                    </div>
                                    <dt className="text-muted-foreground">SKU</dt>
                                    <dd>{product.sku || `LX-${product.id.padStart(5, "0")}`}</dd>
                                </dl>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold">{t.product.shippingInfo}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t.product.shippingDesc}
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="reviews" className="py-6">
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">{t.product.noReviews}</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section className="bg-muted/30 py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">{t.product.related}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
