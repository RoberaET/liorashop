"use server"

import { prisma } from "@/lib/prisma"
import { Order, RegisteredUser } from "@/lib/types"
import bcrypt from "bcryptjs"

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

export async function getAdminDashboardStatsAction() {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                total: true
            }
        })

        const totalOrders = await prisma.order.count()
        const totalProducts = await prisma.product.count()
        const lowStockProducts = await prisma.product.count({
            where: {
                stock: {
                    lt: 10
                }
            }
        })

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        // Get sales for last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentSales = await prisma.order.groupBy({
            by: ['createdAt'],
            _sum: {
                total: true
            },
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        })

        // Get category distribution
        const productsByCategory = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                id: true
            }
        })

        // Get order status distribution
        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        })

        return {
            stats: {
                totalRevenue: totalRevenue._sum.total || 0,
                totalOrders,
                totalProducts,
                lowStockCount: lowStockProducts,
                recentOrders: recentOrders.map((order: any) => ({
                    id: order.id,
                    customerName: order.user?.name || 'Unknown',
                    customerEmail: order.user?.email || 'Unknown', // Fallback
                    shippingAddress: JSON.parse(order.shippingAddress), // Assuming stored as JSON string
                    total: order.total,
                    status: order.status,
                    createdAt: order.createdAt
                })),
                salesData: recentSales,
                categoryData: productsByCategory,
                orderStatusData: ordersByStatus
            }
        }
    } catch (error) {
        console.error("Get admin stats error:", error)
        return { error: "Failed to fetch admin stats" }
    }
}

export async function adminResetUserPasswordAction(userId: string) {
    try {
        // Generate a random 8-character password
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: true
            } as any
        })

        return { success: true, tempPassword }
    } catch (error) {
        console.error("Reset password error:", error)
        return { error: "Failed to reset password" }
    }
}
