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
import { getAllOrdersAction, updateOrderStatusAction, deleteOrderAction } from "@/app/actions/admin"
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
            const result = await getAllOrdersAction()
            if (result.orders) {
                // @ts-ignore
                setOrders(result.orders)
            }
            setIsLoading(false)
        }
        loadOrders()
    }, [])

    const handleStatusUpdate = async (orderId: string, status: Order["status"]) => {
        const order = orders.find(o => o.id === orderId)
        if (!order) return

        const result = await updateOrderStatusAction(orderId, status)
        if (result.error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive"
            })
            return
        }

        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
        toast({
            title: "Order Updated",
            description: `Order #${orderId} status changed to ${status}.`,
        })
    }

    const handleDeleteOrder = async (orderId: string) => {
        const result = await deleteOrderAction(orderId)
        if (result.error) {
            toast({
                title: "Error",
                description: "Failed to delete order",
                variant: "destructive"
            })
            return
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
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <p className="text-muted-foreground">Manage and update customer orders.</p>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono">{order.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.shippingAddress.fullName}</span>
                                            <span className="text-xs text-muted-foreground">{order.shippingAddress.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{formatPrice(order.total)}</TableCell>
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
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
