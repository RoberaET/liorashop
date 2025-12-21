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

interface ProductDetailsProps {
    product: Product
    relatedProducts: Product[]
    discount: number
}

export function ProductDetails({ product, relatedProducts, discount }: ProductDetailsProps) {
    const { t } = useLanguage()

    return (
        <>
            {/* Breadcrumb - Included here or parent? Parent has it. 
          Actually, let's keep breadcrumb in client component for consistency if we want "Home" to be translated.
          But parent had breadcrumb logic. 
          I'll extract breadcrumb here or just render it. 
          Let's render it here to translate "Home".
      */}
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
                                {/* This text was hardcoded. I will use the description again or leave empty if redundant */}
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
            {relatedProducts.length > 0 && (
                <section className="bg-muted/30 py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">{t.product.related}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
