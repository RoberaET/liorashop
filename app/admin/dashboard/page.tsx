"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { Package, ShoppingCart, TrendingUp } from "lucide-react"
import { getAdminDashboardStatsAction } from "@/app/actions/admin"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

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

    const { totalRevenue, totalOrders, totalProducts, recentOrders, salesData, categoryData, lowStockCount, orderStatusData } = stats

    const maxSales = Math.max(...(salesData?.map((d: any) => d._sum.total) || []), 100)
    const categoryColors = ["bg-blue-500", "bg-cyan-500", "bg-sky-500", "bg-indigo-500", "bg-teal-500", "bg-emerald-500"]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div>
                <motion.h2 variants={item} className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</motion.h2>
                <motion.p variants={item} className="text-slate-500">Overview of your store's performance.</motion.p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <motion.div variants={item}>
                    <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900">{formatPrice(totalRevenue)}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900">{totalOrders}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Products</CardTitle>
                            <Package className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-900">{totalProducts}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div variants={item} className="col-span-4">
                    <Card className="border-blue-100 h-full bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                                    <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">No orders yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {recentOrders.map((order: any) => (
                                        <div key={order.id} className="flex items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none text-slate-900">
                                                    {order.shippingAddress.fullName}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {order.shippingAddress.email}
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium text-blue-700">+{formatPrice(order.total)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item} className="col-span-3">
                    <Card className="border-blue-100 h-full bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px] flex items-end justify-between gap-2">
                            {/* Simplified histogram since we have limited formatted date logic on server */}
                            {salesData.length === 0 ? <p className="text-slate-400 text-sm m-auto">No sales data</p> : salesData.map((day: any, i: number) => {
                                const heightPercentage = ((day._sum.total || 0) / maxSales) * 100
                                return (
                                    <div key={i} className="w-full bg-blue-100 hover:bg-blue-300 rounded-t-sm relative group transition-all" style={{ height: `${heightPercentage || 5}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                                            {formatPrice(day._sum.total || 0)}
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={item}>
                    <Card className="border-blue-100 h-full bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {orderStatusData.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-slate-400">
                                    No orders yet
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="_count.id"
                                            nameKey="status"
                                        >
                                            {orderStatusData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                                        />
                                        <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-blue-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Category Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <div className="flex gap-4 flex-wrap justify-center p-4">
                                {categoryData.map((cat: any, i: number) => (
                                    <div key={cat.category} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                        <div className={`w-2.5 h-2.5 rounded-full ${categoryColors[i % categoryColors.length]}`} />
                                        <span className="text-sm font-medium capitalize text-slate-700">{cat.category} ({cat._count.id})</span>
                                        <span className="text-xs text-slate-400">|</span>
                                        <span className="text-xs font-semibold text-slate-900">{Math.round((cat._count.id / totalProducts) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-blue-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Inventory Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <div className="text-4xl font-extrabold text-red-500 mb-2">{lowStockCount}</div>
                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Low Stock Products</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    )
}
