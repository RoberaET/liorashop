"use client"

import { useState, useEffect } from "react"
import { Heart, Minus, Plus, ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useFlyAnimation } from "@/components/fly-animation-provider"

import { db } from "@/lib/db"

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  // Local stock state to track real-time changes
  const [currentStock, setCurrentStock] = useState(product.stock)

  const addToCart = useStore((state) => state.addToCart)
  const addToWishlist = useStore((state) => state.addToWishlist)
  const removeFromWishlist = useStore((state) => state.removeFromWishlist)
  const wishlist = useStore((state) => state.wishlist)
  const { triggerFlyAnimation } = useFlyAnimation()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Fetch latest stock from DB to ensure accuracy
    const dbProduct = db.getProduct(product.id)
    if (dbProduct) {
      setCurrentStock(dbProduct.stock)
    }
  }, [product.id])

  const inWishlist = isMounted ? wishlist.some((item) => item.product.id === product.id) : false

  const handleAddToCart = (e: React.MouseEvent) => {
    // Trigger Animation
    const targetId = "nav-cart-icon"
    const target = document.getElementById(targetId)
    // Find the main product image using the specific class
    const productImage = document.querySelector(".product-main-image") as HTMLElement

    if (target && productImage) {
      const startRect = productImage.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      triggerFlyAnimation(startRect, targetRect, product.images?.[0] || product.image || "/placeholder.svg")
    }

    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()

    // Trigger Animation
    const targetId = "nav-wishlist-icon"
    const target = document.getElementById(targetId)
    // Find the main product image using the specific class
    const productImage = document.querySelector(".product-main-image") as HTMLElement

    if (target && productImage && !inWishlist) {
      const startRect = productImage.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      triggerFlyAnimation(startRect, targetRect, product.images?.[0] || product.image || "/placeholder.svg")
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center border border-border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
            disabled={quantity >= currentStock}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={currentStock === 0 || addedToCart}>
          {addedToCart ? (
            <>
              <Check className="h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              {currentStock > 0 ? (currentStock < 5 ? `Only ${currentStock} left` : "Add to Cart") : "Out of Stock"}
            </>
          )}
        </Button>
        <Button variant="outline" size="lg" className="px-4 bg-transparent" onClick={handleWishlistToggle}>
          <Heart className={cn("h-5 w-5 transition-colors", inWishlist && "fill-destructive text-destructive")} />
          <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
        </Button>
      </div>
    </div>
  )
}
