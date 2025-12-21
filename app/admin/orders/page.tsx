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
import { format } from "date-fns"
import { db } from "@/lib/db"
import { Order } from "@/lib/types"
import { useEffect, useState } from "react"

export default function AdminOrdersPage() {
    // const orders = useStore((state) => state.orders) // Removed: useStore only has current user orders
    const updateOrderStatus = useStore((state) => state.updateOrderStatus)
    const removeOrder = useStore((state) => state.removeOrder)
    const mounted = useMounted()

    // Fetch all orders for admin
    const [orders, setOrders] = useState<(Order & { userId: string })[]>([])

    const refreshOrders = () => {
        if (mounted) {
            const allOrders = db.getAllOrders()
            setOrders(allOrders)
        }
    }

    useEffect(() => {
        refreshOrders()
    }, [mounted])

    const handleStatusUpdate = (orderId: string, status: any) => {
        // Find order to get userId
        const order = orders.find(o => o.id === orderId)
        if (order) {
            db.updateOrderStatus(order.userId, orderId, status)
            refreshOrders()
        }
    }

    const handleDeleteOrder = (orderId: string) => {
        // Removing requires userId? db doesn't have removeOrder yet? 
        // Check Store: store.removeOrder removes from store state.
        // DB needs a removeOrder method? Or updateOrderStatus to 'cancelled' (which is done by status update).
        // The UI has a delete button (Trash2).

        // Assuming we just want to remove it visually or actually delete?
        // Store has removeOrder:
        // removeOrder: (orderId) => set((state) => ({ orders: state.orders.filter(...) }))

        // If we want to delete from DB, we need db.removeOrder(userId, orderId).
        // Currently db.ts does NOT have removeOrder. 
        // I will implement a quick db.removeOrder or just disable functionality for now.
        // Actually, let's just make it 'cancelled' via status update for safety or implement remove.
        // The user code had removeOrder mapped to store.

        // Let's implement db.removeOrder quickly if needed, or just handleStatusUpdate("cancelled").
        // The current Trash icon implies delete.

        // For now, I will modify the trash action to invoke a new db.removeOrder logic or just console log pending.
        // Actually, let's just hide the trash button or implement standard status filtering.
        // Wait, the user prompt is about *syncing*. I should stick to that.

        // I'll leave the delete button non-functional or logging a warning for now, 
        // OR better, assuming I need to add verify db support.
        // But wait, the previous code had `removeOrder` from useStore.

        // Let's stick to status updates first which is the main requirement.
        // For delete, I will comment it out or leave as is (it won't persist if it just calls store.removeOrder on the wrong store).
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-500 hover:bg-green-600"
            case "pending": return "bg-orange-500 hover:bg-orange-600"
            case "shipped": return "bg-yellow-500 hover:bg-yellow-600"
            case "delivered": return "bg-green-700 hover:bg-green-800"
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
                        {orders.length === 0 ? (
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
                                                onValueChange={(value) => handleStatusUpdate(order.id, value)}
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
                                                        db.deleteOrder(order.userId, order.id)
                                                        refreshOrders()
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
