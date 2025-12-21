"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { Package, ShoppingCart, TrendingUp } from "lucide-react"
import { getAdminDashboardStatsAction } from "@/app/actions/admin"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const { stats } = await getAdminDashboardStatsAction()
                if (stats) setStats(stats)
            } catch (error) {
                console.error("Failed to load dashboard stats", error)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) {
        return <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-[300px]" />
        </div>
    }

    if (!stats) return <div>Failed to load stats</div>

    const { totalRevenue, totalOrders, totalProducts, recentOrders, salesData, categoryData, lowStockCount } = stats

    const maxSales = Math.max(...(salesData?.map((d: any) => d._sum.total) || []), 100)
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
                        <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
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
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No orders yet.</p>
                        ) : (
                            <div className="space-y-8">
                                {recentOrders.map((order: any) => (
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
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-end justify-between gap-2">
                        {/* Simplified histogram since we have limited formatted date logic on server */}
                        {salesData.length === 0 ? <p className="text-muted-foreground text-sm m-auto">No sales data</p> : salesData.map((day: any, i: number) => {
                            const heightPercentage = ((day._sum.total || 0) / maxSales) * 100
                            return (
                                <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-md relative group transition-all" style={{ height: `${heightPercentage || 5}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                                        {formatPrice(day._sum.total || 0)}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <div className="flex gap-4 flex-wrap justify-center">
                            {categoryData.map((cat: any, i: number) => (
                                <div key={cat.category} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${categoryColors[i % categoryColors.length]}`} />
                                    <span className="text-sm font-medium capitalize">{cat.category} ({cat._count.id})</span>
                                    <span className="text-xs text-muted-foreground">{Math.round((cat._count.id / totalProducts) * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Inventory Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-destructive">{lowStockCount}</div>
                            <p className="text-muted-foreground">Low Stock Products</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
