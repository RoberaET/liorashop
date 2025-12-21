"use server"

import { prisma } from "@/lib/prisma"
import { CartItem, Address, Order } from "@/lib/types"

// Helper to convert Prisma Order to Frontend Order type
// We need to parse shippingAddress (JSON) and map items
const mapPrismaOrderToFrontend = (prismaOrder: any): Order => {
    return {
        ...prismaOrder,
        // Status cast (ensure DB values match Union type)
        status: prismaOrder.status as any,
        shippingAddress: JSON.parse(prismaOrder.shippingAddress),
        items: prismaOrder.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity
        }))
    }
}

export async function createOrderAction(userId: string, items: CartItem[], total: number, shippingAddress: Address) {
    try {
        const newOrder = await prisma.order.create({
            data: {
                userId,
                total,
                status: "pending",
                shippingAddress: JSON.stringify(shippingAddress),
                items: {
                    create: items.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return { order: mapPrismaOrderToFrontend(newOrder) }
    } catch (error) {
        console.error("Create order error:", error)
        return { error: "Failed to create order" }
    }
}

export async function getUserOrdersAction(userId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return { orders: orders.map(mapPrismaOrderToFrontend) }
    } catch (error) {
        console.error("Get user orders error:", error)
        return { error: "Failed to fetch orders" }
    }
}

export async function cancelOrderAction(orderId: string, userId: string) {
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order || order.userId !== userId) {
            return { error: "Order not found or unauthorized" }
        }

        if (order.status !== 'pending' && order.status !== 'confirmed') {
            return { error: "Cannot cancel order in this status" }
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' }
        })
        return { success: true }
    } catch (error) {
        console.error("Cancel order error:", error)
        return { error: "Failed to cancel order" }
    }
}
