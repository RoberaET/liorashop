"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { useMounted } from "@/hooks/use-mounted"

export function OrdersContent() {
    const router = useRouter()
    const user = useStore((state) => state.user)
    const orders = useStore((state) => state.orders)
    const mounted = useMounted()
    const [expandedOrders, setExpandedOrders] = useState<string[]>([])

    useEffect(() => {
        if (mounted && !user) {
            router.push("/login")
        }
    }, [mounted, user, router])

    if (!mounted || !user) {
        return null
    }

    const toggleOrder = (orderId: string) => {
        setExpandedOrders((prev) =>
            prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "shipped":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "confirmed":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/account">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-serif font-bold">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg bg-muted/20">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-medium mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                        <Button asChild>
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            const isExpanded = expandedOrders.includes(order.id)

                            return (
                                <Card key={order.id} className="overflow-hidden">
                                    <div className="p-6 border-b bg-muted/30">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold px-20">Order #{order.id}</span>
                                                    <Badge variant="outline" className={getStatusColor(order.status)}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Placed on {date}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-centergap-4">
                                                <div className="text-right mr-4">
                                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                                    <p className="font-semibold">{formatPrice(order.total)}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => toggleOrder(order.id)}>
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    <span className="sr-only">Toggle details</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                                            {/* Items */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold flex items-center gap-2">
                                                    <Package className="h-4 w-4" /> Items
                                                </h3>
                                                <div className="space-y-4">
                                                    {order.items.map((item) => (
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
                                                                <Link href={`/product/${item.product.id}`} className="font-medium hover:underline">
                                                                    {item.product.name}
                                                                </Link>
                                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="border-t pt-6"></div>

                                            {/* Shipping Address */}
                                            <div>
                                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                                    <MapPin className="h-4 w-4" /> Shipping Address
                                                </h3>
                                                <address className="not-italic text-sm text-muted-foreground">
                                                    <p>{order.shippingAddress.fullName}</p>
                                                    <p>{order.shippingAddress.street}</p>
                                                    <p>
                                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                                    </p>
                                                    <p>{order.shippingAddress.country}</p>
                                                    <p>{order.shippingAddress.phone}</p>
                                                </address>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
