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

export default function AdminOrdersPage() {
    const orders = useStore((state) => state.orders)
    const updateOrderStatus = useStore((state) => state.updateOrderStatus)
    const removeOrder = useStore((state) => state.removeOrder)
    const mounted = useMounted()

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
                                                onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this order?")) {
                                                        removeOrder(order.id)
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
