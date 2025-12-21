"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Package, ShoppingCart, TrendingUp } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"
import { products } from "@/lib/data"
import { db } from "@/lib/db"
import { Order } from "@/lib/types"

export default function AdminDashboard() {
    // const orders = useStore((state) => state.orders) // Removed
    const mounted = useMounted()

    // We need to fetch orders synchronously or assume mounted? 
    // Since useMounted returns bool, we can just fetch:

    // Actually, db actions are synchronous in this mock.
    // If we want it to be safe:

    const orders = mounted ? db.getAllOrders() : []

    if (!mounted) return null

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const totalProducts = products.length

    // Calculate Sales per Day (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d.toISOString().split("T")[0]
    })

    const salesData = last7Days.map(date => {
        const dailyOrders = orders.filter(o => {
            // Handle different date formats if necessary, assuming ISO string from store
            const orderDate = new Date(o.createdAt).toISOString().split("T")[0]
            return orderDate === date
        })
        return dailyOrders.reduce((sum, o) => sum + o.total, 0)
    })

    const maxSales = Math.max(...salesData, 100) // Avoid division by zero, min scale 100

    // Calculate Category Distribution
    const categories = Array.from(new Set(products.map(p => p.category)))
    const categoryData = categories.map(cat => {
        const count = products.filter(p => p.category === cat).length
        return { name: cat, count, percentage: Math.round((count / products.length) * 100) }
    })
    const categoryColors = ["bg-red-500", "bg-blue-500", "bg-pink-500", "bg-purple-500", "bg-orange-500", "bg-green-500"]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No orders yet.</p>
                        ) : (
                            <div className="space-y-8">
                                {orders.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {order.shippingAddress.fullName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.shippingAddress.email}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">+{formatPrice(order.total)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Low Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {products.filter(p => p.stock < 5).length === 0 ? (
                                <p className="text-sm text-muted-foreground">All products are well stocked.</p>
                            ) : (
                                products.filter(p => p.stock < 10).map(product => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{product.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Stock:</span>
                                            <span className="font-bold text-destructive">{product.stock}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-end justify-between gap-2">
                        {salesData.map((sales, i) => {
                            const heightPercentage = (sales / maxSales) * 100
                            return (
                                <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-md relative group transition-all" style={{ height: `${heightPercentage || 5}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                                        {formatPrice(sales)}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        {/* Simple CSS Pie Chart representation */}
                        <div className="flex gap-4 flex-wrap justify-center">
                            {categoryData.map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${categoryColors[i % categoryColors.length]}`} />
                                    <span className="text-sm font-medium capitalize">{cat.name} ({cat.count})</span>
                                    <span className="text-xs text-muted-foreground">{cat.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
