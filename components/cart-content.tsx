"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"

export function CartContent() {
  const { t } = useLanguage()
  const cart = useStore((state) => state.cart)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const updateQuantity = useStore((state) => state.updateQuantity)
  const getCartTotal = useStore((state) => state.getCartTotal)

  const subtotal = getCartTotal()
  const shipping = subtotal > 10000 ? 0 : 1000
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-serif font-bold mb-4">{t.cart.empty}</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/">{t.cart.continueShopping}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">{t.cart.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 bg-card rounded-lg border border-border">
              {/* Product Image */}
              <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground capitalize mt-1">{item.product.category}</p>

                {/* Price */}
                <div className="mt-2">
                  <span className="font-semibold">{formatPrice(item.product.price)}</span>
                  {item.product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      {formatPrice(item.product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Quantity & Remove - Mobile */}
                <div className="flex items-center justify-between mt-4 md:hidden">
                  <div className="flex items-center border border-border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quantity & Remove - Desktop */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-24 text-right font-semibold">{formatPrice(item.product.price * item.quantity)}</div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t.cart.remove}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>


              <Separator />

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping === 0 && <p className="text-xs text-green-600 mt-4">You qualify for free shipping!</p>}

            <Button asChild className="w-full mt-6 gap-2" size="lg">
              <Link href="/checkout">
                {t.cart.checkout}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>


          </div>
        </div>
      </div>
    </div>
  )
}
