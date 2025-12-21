"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import { cn, formatPrice } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFlyAnimation } from "@/components/fly-animation-provider"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { triggerFlyAnimation } = useFlyAnimation()
  const addToCart = useStore((state) => state.addToCart)
  const addToWishlist = useStore((state) => state.addToWishlist)
  const removeFromWishlist = useStore((state) => state.removeFromWishlist)
  const wishlist = useStore((state) => state.wishlist)

  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Avoid hydration mismatch by only checking wishlist on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const inWishlist = isMounted ? wishlist.some((item) => item.product.id === product.id) : false

  // Use defined images or fallback to single image
  const images = product.images && product.images.length > 0 ? product.images : [product.image]

  useEffect(() => {
    if (images.length <= 1 || !isHovered) {
      setCurrentImageIndex(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 1500) // Change image every 1.5 seconds for smoother viewing

    return () => clearInterval(interval)
  }, [isHovered, images.length])

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Trigger Animation
    const targetId = "nav-wishlist-icon"
    const target = document.getElementById(targetId)
    const card = (e.currentTarget.closest(".group") as HTMLElement)?.querySelector("img")

    if (target && card && !inWishlist) {
      const startRect = card.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      triggerFlyAnimation(startRect, targetRect, product.image || "/placeholder.svg")
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Trigger Animation
    const targetId = "nav-cart-icon"
    const target = document.getElementById(targetId)
    const card = (e.currentTarget.closest(".group") as HTMLElement)?.querySelector("img")

    if (target && card) {
      const startRect = card.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      triggerFlyAnimation(startRect, targetRect, product.image || "/placeholder.svg")
    }

    addToCart(product)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            {/* Image Slider */}
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <div key={`${img}-${index}`} className="relative h-full w-full flex-shrink-0">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {discount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discount}%
                </Badge>
              )}
              {product.tags?.includes("bestseller") && (
                <Badge className="bg-primary text-primary-foreground text-xs">Bestseller</Badge>
              )}
              {product.tags?.includes("luxury") && (
                <Badge className="bg-zinc-900 text-white text-xs">Luxury</Badge>
              )}
            </div>


            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10",
                      inWishlist && "opacity-100",
                    )}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={cn("h-4 w-4 transition-colors", inWishlist && "fill-destructive text-destructive")} />
                    <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Quick Add Button */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <Button className="w-full gap-2" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingBag className="h-4 w-4" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-medium text-foreground line-clamp-1 mb-2">{product.name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )

}
