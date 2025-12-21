"use server"

import { prisma } from "@/lib/prisma"
import { Order, RegisteredUser } from "@/lib/types"

const mapPrismaOrderToFrontend = (prismaOrder: any): Order & { userId: string } => {
    return {
        ...prismaOrder,
        status: prismaOrder.status as any,
        shippingAddress: JSON.parse(prismaOrder.shippingAddress),
        items: prismaOrder.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity
        })),
        userId: prismaOrder.userId
    }
}

export async function getAllUsersAction() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                addresses: true
            }
        })

        // Remove passwords
        const safeUsers = users.map((user: any) => {
            const { password, ...rest } = user
            return rest as unknown as RegisteredUser
        })

        return { users: safeUsers }
    } catch (error) {
        console.error("Get all users error:", error)
        return { error: "Failed to fetch users" }
    }
}

export async function deleteUserAction(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        return { success: true }
    } catch (error) {
        console.error("Delete user error:", error)
        return { error: "Failed to delete user" }
    }
}

export async function getAllOrdersAction() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: { name: true, email: true }
                }
            }
        })

        return { orders: orders.map(mapPrismaOrderToFrontend) }
    } catch (error) {
        console.error("Get all orders error:", error)
        return { error: "Failed to fetch orders" }
    }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
    try {
        const normalizedStatus = status.toLowerCase()

        await prisma.order.update({
            where: { id: orderId },
            data: { status: normalizedStatus }
        })
        return { success: true }
    } catch (error) {
        console.error("Update order status error:", error)
        return { error: "Failed to update order status" }
    }
}

export async function deleteOrderAction(orderId: string) {
    try {
        await prisma.order.delete({
            where: { id: orderId }
        })
        return { success: true }
    } catch (error) {
        console.error("Delete order error:", error)
        return { error: "Failed to delete order" }
    }
}
