"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"

export function WishlistContent() {
  const wishlist = useStore((state) => state.wishlist)
  const removeFromWishlist = useStore((state) => state.removeFromWishlist)
  const addToCart = useStore((state) => state.addToCart)

  const handleMoveToCart = (item: (typeof wishlist)[0]) => {
    addToCart(item.product)
    removeFromWishlist(item.product.id)
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-serif font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">Save items you love by clicking the heart icon on any product.</p>
          <Button asChild size="lg">
            <Link href="/">Explore Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-serif font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{wishlist.length} saved items</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.product.id} className="group bg-card rounded-lg border border-border overflow-hidden">
            {/* Product Image */}
            <Link href={`/product/${item.product.id}`}>
              <div className="relative aspect-square bg-muted">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.product.category}</p>
              <Link href={`/product/${item.product.id}`}>
                <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{item.product.name}</h3>
              </Link>

              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatPrice(item.product.price)}</span>
                {item.product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(item.product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleMoveToCart(item)}
                  disabled={!item.product.inStock}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {item.product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 bg-transparent"
                  onClick={() => removeFromWishlist(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
