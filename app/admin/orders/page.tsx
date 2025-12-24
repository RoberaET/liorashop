"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMounted } from "@/hooks/use-mounted"
import { db } from "@/lib/db"
import { Order } from "@/lib/types"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function AdminOrdersPage() {
    const mounted = useMounted()
    const { toast } = useToast()

    // Fetch all orders for admin
    const [orders, setOrders] = useState<(Order & { userId: string })[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadOrders = async () => {
            // Updated to use Simulated DB
            const allOrders = db.getAllOrders()
            // @ts-ignore
            setOrders(allOrders)
            setIsLoading(false)
        }
        loadOrders()
    }, [])

    const handleStatusUpdate = async (orderId: string, status: Order["status"]) => {
        const order = orders.find(o => o.id === orderId)
        if (!order) return

        // Update in Simulated DB
        db.updateOrderStatus(order.userId, orderId, status)

        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
        toast({
            title: "Order Updated",
            description: `Order #${orderId} status changed to ${status}.`,
        })
    }

    const handleDeleteOrder = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId)
        if (order) {
            // Delete from Simulated DB
            db.deleteOrder(order.userId, orderId)
        }

        setOrders(orders.filter(o => o.id !== orderId))
        toast({
            title: "Order Deleted",
            description: `Order #${orderId} has been deleted.`
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-500 hover:bg-green-600"
            case "pending": return "bg-orange-500 hover:bg-orange-600"
            case "shipped": return "bg-yellow-500 hover:bg-yellow-600"
            case "delivered": return "bg-green-700 hover:bg-green-800"
            case "cancelled": return "bg-red-500 hover:bg-red-600"
            default: return "bg-slate-500"
        }
    }

    if (!mounted) return null

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h2>
                <p className="text-slate-600">Manage and update customer orders.</p>
            </div>

            <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Order ID</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Customer</TableHead>
                            <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Date</TableHead>
                            <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Time</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Total</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Status</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                                    <TableCell className="hidden md:table-cell font-mono text-orange-700 font-bold">{order.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-purple-800">{order.shippingAddress.fullName}</span>
                                            <span className="text-xs text-slate-500">{order.shippingAddress.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-amber-800 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="hidden md:table-cell text-slate-600 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                    <TableCell className="text-emerald-700 font-extrabold">{formatPrice(order.total)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(value) => handleStatusUpdate(order.id, value as Order["status"])}
                                            >
                                                <SelectTrigger className="w-[130px] border-slate-300 text-slate-900">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-slate-200">
                                                    <SelectItem value="pending" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Pending</SelectItem>
                                                    <SelectItem value="confirmed" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Confirmed</SelectItem>
                                                    <SelectItem value="shipped" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Shipped</SelectItem>
                                                    <SelectItem value="delivered" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Delivered</SelectItem>
                                                    <SelectItem value="cancelled" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this order?")) {
                                                        handleDeleteOrder(order.id)
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
