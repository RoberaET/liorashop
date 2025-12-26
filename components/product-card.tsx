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
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F7] rounded-lg mb-4">
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
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {discount > 0 && (
                <Badge variant="destructive" className="text-[10px] px-2 py-0.5 h-auto">
                  -{discount}%
                </Badge>
              )}
              {product.tags?.includes("bestseller") && (
                <Badge className="bg-white text-black text-[10px] px-2 py-0.5 h-auto border-none shadow-sm">Bestseller</Badge>
              )}
            </div>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "absolute top-3 right-3 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 hover:bg-white text-black",
                      inWishlist && "opacity-100 text-red-500",
                    )}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={cn("h-4 w-4 transition-colors", inWishlist && "fill-current")} />
                    <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Quick Add Button */}
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <Button className="w-full gap-2 rounded-full bg-white text-black hover:bg-white/90 shadow-md text-xs h-9" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingBag className="h-3.5 w-3.5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-medium text-foreground text-sm tracking-wide mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{product.category}</p>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-xs">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )

}
