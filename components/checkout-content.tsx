"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"

const COUPONS: { [key: string]: number } = {
  "LOVE": 0.10,
}

export function CheckoutContent() {
  const router = useRouter()
  const { t } = useLanguage()
  const cart = useStore((state) => state.cart)
  const clearCart = useStore((state) => state.clearCart)
  const getCartTotal = useStore((state) => state.getCartTotal)
  const setShippingAddress = useStore((state) => state.setShippingAddress)
  const { user, isLoading } = useAuth()

  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"shipping" | "payment">("shipping")

  // Form state
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Ethiopia",
  })

  // Auto-fill form with default address
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses[0]
      setShippingForm({
        fullName: defaultAddress.fullName,
        email: defaultAddress.email || user.email || "",
        phone: defaultAddress.phone,
        street: defaultAddress.street,
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country,
      })
    } else if (user?.email) {
      // Pre-fill email even if no address
      setShippingForm(prev => ({ ...prev, email: user.email }))
    }
  }, [user])

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  const [shippingMethod, setShippingMethod] = useState("standard")
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  // Coupon state
  const [couponCode, setCouponCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  const handleApplyCoupon = () => {
    const discount = COUPONS[couponCode.toUpperCase()]
    if (discount) {
      setAppliedDiscount(discount)
      setCouponError(null)
    } else {
      setCouponError(t.checkout.couponError)
      setAppliedDiscount(null)
    }
  }

  const paymentMethods = [
    { name: "Telebirr", icon: "/payment icons/telebirr.jpg", account: "+251976144230", holder: "Rebika Abebe Yiblet" },
    { name: "Commercial Bank of Ethiopia", icon: "/payment icons/cbe.jpg", account: "1000629590092", holder: "Rebika Abebe Yiblet" },
    { name: "Awash Bank", icon: "/payment icons/awash.jpg", account: "01320727291100", holder: "Rebika Abebe Yiblet" },
    { name: "Wegagen Bank", icon: "/payment icons/wegagen.jpg", account: "0760626531702", holder: "Rebika Abebe Yiblet" },
    { name: "Dashen Bank", icon: "/payment icons/dashen.jpg", account: "5120328417011", holder: "Rebika Abebe Yiblet" },
  ]

  const handleCopy = (account: string) => {
    navigator.clipboard.writeText(account)
    setCopiedAccount(account)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const subtotal = getCartTotal()
  const shippingCost = shippingMethod === "express" ? 300 : 0
  const discountAmount = appliedDiscount ? subtotal * appliedDiscount : 0
  const total = subtotal + shippingCost - discountAmount

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">{t.cart.empty}</h1>
          <p className="text-muted-foreground mb-8">Add items to your cart to proceed with checkout.</p>
          <Button asChild size="lg">
            <Link href="/">{t.cart.continueShopping}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShippingAddress({
      fullName: shippingForm.fullName,
      email: shippingForm.email,
      street: shippingForm.street,
      city: shippingForm.city,
      state: shippingForm.state,
      zipCode: shippingForm.zipCode,
      country: shippingForm.country,
      phone: shippingForm.phone,
    })
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const addOrder = useStore.getState().addOrder

    // Create new order
    // Check if user is logged in
    const userId = user ? user.id : "guest"

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      items: [...cart],
      total: total,
      status: "confirmed",
      createdAt: new Date(),
      shippingAddress: {
        fullName: shippingForm.fullName,
        email: shippingForm.email,
        street: shippingForm.street,
        city: shippingForm.city,
        state: shippingForm.state,
        zipCode: shippingForm.zipCode,
        country: shippingForm.country,
        phone: shippingForm.phone,
      }
    }

    addOrder(newOrder)

    // Save to DB
    if (user) {
      db.saveOrder(user.id, newOrder)
    }

    clearCart()
    router.push("/checkout/success")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.checkout.backToCart}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-serif font-bold mb-8">{t.checkout.title}</h1>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 ${step === "shipping" ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  1
                </span>
                <span className="text-sm font-medium">{t.checkout.shipping}</span>
              </div>
              <div className="flex-1 h-px bg-border" />
              <div
                className={`flex items-center gap-2 ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  2
                </span>
                <span className="text-sm font-medium">{t.checkout.payment}</span>
              </div>
            </div>

            {/* Shipping Form */}
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.checkout.shippingInfo}</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-6 space-y-2">
                      <Label>{t.checkout.savedAddresses}</Label>
                      <Select
                        onValueChange={(value) => {
                          const address = user.addresses[parseInt(value)]
                          if (address) {
                            setShippingForm({
                              fullName: address.fullName,
                              email: address.email || shippingForm.email,
                              phone: address.phone,
                              street: address.street,
                              city: address.city,
                              state: address.state,
                              zipCode: address.zipCode,
                              country: address.country,
                            })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.checkout.selectAddress} />
                        </SelectTrigger>
                        <SelectContent>
                          {user.addresses.map((addr, idx) => (
                            <SelectItem key={idx} value={idx.toString()}>
                              {addr.fullName} - {addr.street}, {addr.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">{t.checkout.or}</span>
                        <Separator className="flex-1" />
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t.checkout.fullName}</Label>
                        <Input
                          id="fullName"
                          placeholder={t.auth.namePlaceholder}
                          value={shippingForm.fullName}
                          onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.checkout.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t.auth.emailPlaceholder}
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.checkout.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+251 912 345 678"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">{t.checkout.street}</Label>
                      <Input
                        id="street"
                        placeholder="Bole Rwanda Rd."
                        value={shippingForm.street}
                        onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">{t.checkout.city}</Label>
                          <Input
                            id="city"
                            placeholder="Addis Ababa"
                            value={shippingForm.city}
                            onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">{t.checkout.zipCode}</Label>
                          <Input
                            id="zipCode"
                            placeholder="1000"
                            value={shippingForm.zipCode}
                            onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="space-y-4 pt-4">
                      <Label>{t.checkout.shippingMethod}</Label>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                        <div className="flex items-center space-x-4 p-4 border border-border rounded-lg w-full">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1 cursor-pointer w-full">
                            <div className="flex justify-between items-center w-full">
                              <div>
                                <p className="font-medium">{t.checkout.standard}</p>
                                <p className="text-sm text-muted-foreground">1 - 2 days</p>
                              </div>
                              <span className="font-medium">Free</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-4 p-4 border border-border rounded-lg w-full">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1 cursor-pointer w-full">
                            <div className="flex justify-between items-center w-full">
                              <div>
                                <p className="font-medium">{t.checkout.express}</p>
                                <p className="text-sm text-muted-foreground">maximum 2 hour</p>
                              </div>
                              <span className="font-medium">ETB 300.00</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      {t.checkout.payment}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Form */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {t.checkout.paymentDetails}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      Secure
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4" />
                        <h3 className="font-semibold">{t.checkout.paymentOptions}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t.checkout.paymentNote}
                      </p>

                      <div className="space-y-3 mt-4 text-sm">
                        {paymentMethods.map((method) => (
                          <div key={method.name} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-3">
                              <div className="relative h-8 w-8 rounded overflow-hidden flex-shrink-0">
                                <Image src={method.icon || "/placeholder.svg"} alt={method.name} fill className="object-cover" />
                              </div>
                              <span className="font-medium">{method.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="font-mono text-muted-foreground">{method.account}</p>
                                <p className="text-xs text-muted-foreground">{method.holder}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopy(method.account)}
                              >
                                {copiedAccount === method.account ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-yellow-500/10 rounded border border-yellow-500/50 text-sm">
                        <p className="font-medium text-yellow-600 mb-1">{t.checkout.importantWarning}</p>
                        <p className="text-muted-foreground">
                          {t.checkout.warningText}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("shipping")}
                      >
                        {t.checkout.back}
                      </Button>
                      <Button type="submit" size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isProcessing || isLoading}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t.checkout.processing}
                          </>
                        ) : (
                          `${t.checkout.confirmOrder} - ${formatPrice(total)}`
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t.checkout.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t.checkout.couponPlaceholder}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>{t.checkout.apply}</Button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                  {appliedDiscount && <p className="text-xs text-green-500">{t.checkout.copuonSuccess}</p>}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.checkout.shipping}</span>
                    <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-primary">
                      <span>{t.checkout.discount} ({appliedDiscount * 100}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg text-primary">
                  <span>{t.cart.total}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
