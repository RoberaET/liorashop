"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SuccessContent() {
    const [mounted, setMounted] = useState(false)
    const orderNumber = `LX${Date.now().toString().slice(-8)}`

    useEffect(() => {
        setMounted(true)
        // Play success sound
        const audio = new Audio("/sounds/order-confirmed.mp3")
        audio.play().catch((err) => console.log("Audio play failed:", err))
    }, [])

    if (!mounted) return null

    return (
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-serif font-bold">Order Confirmed!</h1>
                <p className="text-muted-foreground">
                    Thank you for your purchase. We will call you shortly to confirm your order.
                </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Order Number</span>
                </div>
                <p className="text-2xl font-mono font-semibold">{orderNumber}</p>
            </div>

            <div className="space-y-3">
                <Button asChild size="lg" className="w-full gap-2">
                    <Link href="/">
                        Continue Shopping
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link href="/account">View Orders</Link>
                </Button>
            </div>

            <p className="text-sm text-muted-foreground">
                Questions about your order?{" "}
                <a href="#" className="text-foreground underline">
                    Contact Support
                </a>
            </p>
        </div>
    )
}
